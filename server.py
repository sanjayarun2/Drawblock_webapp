import os
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your modules
from scraper import fetch_web_content
from ai_engine import get_diagram_labels
from renderer import render_diagram

app = FastAPI()

# --- 1. ENABLE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. PREPARE DIRECTORIES ---
os.makedirs("output", exist_ok=True)
os.makedirs("static", exist_ok=True) # Added this to prevent crash if folder is missing

# --- 3. SERVE GENERATED IMAGES ---
app.mount("/output", StaticFiles(directory="output"), name="output")

class RequestData(BaseModel):
    data: str  # Can be URL or Text

@app.post("/generate-diagram")
async def generate_api(request: RequestData):
    user_input = request.data
    labels = []

    try:
        # 1. Check URL
        if user_input.startswith("http"):
            content = fetch_web_content(user_input)
            labels = await get_diagram_labels(content)
        
        # 2. Check Explicit List (Simple comma split)
        elif "," in user_input and len(user_input.split()) < 20:
             labels = [x.strip() for x in user_input.split(",") if x.strip()]

        # 3. Text Description
        else:
            labels = await get_diagram_labels(user_input)

        # 4. Generate Image
        if labels:
            # Use UUID for cleaner filenames
            filename = f"diagram_{uuid.uuid4().hex[:8]}.png"
            output_path = os.path.join("output", filename)
            
            render_diagram(labels, output_filename=output_path)
            
            # Return the Web URL for the image
            return {
                "status": "success", 
                "image_url": f"/output/{filename}", 
                "steps": labels
            }
        
        raise HTTPException(status_code=400, detail="Could not extract steps")

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 4. SERVE FRONTEND (MOVED TO BOTTOM TO FIX API ISSUE) ---
# This must be the last route definition to avoid blocking the API
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)