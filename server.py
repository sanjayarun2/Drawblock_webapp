from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scraper import fetch_web_content
from ai_engine import get_diagram_labels
from renderer import render_diagram
import os

app = FastAPI()

class RequestData(BaseModel):
    data: str  # Can be URL or Text

@app.post("/generate-diagram")
async def generate_api(request: RequestData):
    user_input = request.data
    labels = []

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
        output_path = f"output/diagram_{os.urandom(4).hex()}.png"
        render_diagram(labels, output_filename=output_path)
        return {"status": "success", "image_url": output_path, "steps": labels}
    
    raise HTTPException(status_code=400, detail="Failed to generate diagram")

# Run with: uvicorn server:app --reload