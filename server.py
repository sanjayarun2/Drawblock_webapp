import os
import uuid
import re
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- IMPORT MODULES ---
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
os.makedirs("static", exist_ok=True)

# --- 3. SERVE GENERATED IMAGES ---
app.mount("/output", StaticFiles(directory="output"), name="output")

# --- 4. LOGIC COPIED FROM MAIN.PY ---
# We put these functions here so the server is as smart as main.py
def is_url(string):
    """Simple check to see if input is a URL."""
    return string.startswith("http://") or string.startswith("https://")

def is_explicit_list(string):
    """
    Checks if the user gave a direct comma/newline separated list.
    """
    if "\n" in string or "," in string:
        # Heuristic: If it's short and has delimiters, it's likely a list
        if len(string.split()) < 30: 
            return True
    return False

class RequestData(BaseModel):
    data: str 

@app.post("/generate-diagram")
async def generate_api(request: RequestData):
    # Instead of input(), we get data from the website request
    user_input = request.data.strip()
    labels = []
    
    print(f"👉 Processing: {user_input[:50]}...")

    try:
        # --- LOGIC FLOW (MATCHING MAIN.PY) ---
        
        # CASE A: URL
        if is_url(user_input):
            print("👉 Detected URL input.")
            extracted_content = fetch_web_content(user_input)
            if extracted_content:
                labels = await get_diagram_labels(extracted_content)
        
        # CASE B: User entered an Explicit List (Comma/Newline separated)
        # If user provides comma or newline separated list (short input), use it directly
        elif is_explicit_list(user_input):
            print("👉 Detected Explicit List (Skipping AI extraction).")
            # Split by comma or newline
            labels = [x.strip() for x in re.split(r'[,\n]+', user_input) if x.strip()]
        
        # CASE C: User entered a Description/Prompt
        else:
            print("👉 Detected Text Description.")
            extracted_content = user_input
            # Pass description to AI to abstract the flow
            labels = await get_diagram_labels(extracted_content)

        # --- GENERATE IMAGE ---
        if labels:
            # Create unique filename
            filename = f"diagram_{uuid.uuid4().hex[:8]}.png"
            output_path = os.path.join("output", filename)
            
            # Draw the diagram
            render_diagram(labels, output_filename=output_path)
            
            # Return the path to the frontend
            return {
                "status": "success", 
                "image_url": f"/output/{filename}", 
                "steps": labels
            }
        
        raise HTTPException(status_code=400, detail="Could not extract steps")

    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 5. SERVE FRONTEND (This must be at the bottom) ---
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    # 0.0.0.0 is required for Render deployment
    uvicorn.run(app, host="0.0.0.0", port=8000)