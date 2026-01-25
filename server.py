import os
import uuid
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil

# Import your modules
from scraper import fetch_web_content
from ai_engine import get_diagram_labels
from renderer import render_diagram

app = FastAPI()

# --- 1. ENABLE CORS (Important for frontend connection) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. SERVE GENERATED IMAGES 👈 CRITICAL FIX ---
# This lets the browser see the images inside the 'output' folder
os.makedirs("output", exist_ok=True)
app.mount("/output", StaticFiles(directory="output"), name="output")

# --- 3. SERVE FRONTEND (INDEX.HTML) 👈 CRITICAL FIX ---
# This tells the server: "When user visits '/', show them the 'static' folder"
app.mount("/", StaticFiles(directory="static", html=True), name="static")

class RequestData(BaseModel):
    data: str  # Can be URL or Text

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Create uploads directory if it doesn't exist
        os.makedirs("uploads", exist_ok=True)
        
        # Safe filename
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join("uploads", filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # TODO: Process the image here if needed
        # For now, just return success
        
        return {
            "success": True, 
            "filename": filename,
            "message": "File uploaded successfully"
        }
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
