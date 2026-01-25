import asyncio
import os
import time
import json
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# --- 1. CONFIGURATION ---
MODEL_NAME = "gemini-2.5-flash-lite"
API_KEY = "AIzaSyCF9iaJ9yxUo_gwyOLiz4hxpPDjaa3Mzhg" 

# --- 2. UNIVERSAL SCHEMA ---
class DiagramStep(BaseModel):
    id: str = Field(description="Unique snake_case ID")
    label: str = Field(description="The display text for the block.")
    type: str = Field(description="Must be: 'start', 'process', 'decision', 'end'")
    target: str = Field(description="Next step ID")

# --- 3. GLOBAL CLIENT ---
client = genai.Client(api_key=API_KEY)

async def generate_universal_flow(extracted_text):
    """
    Core function that talks to Gemini.
    """
    prompt = f"""
    TASK: Convert the INPUT TEXT into a block diagram structure.

    [CRITICAL INPUT HANDLING]
    1. **CASE A: Random Words / Nonsense / Direct List:**
       - If the input is just words like "dsjsufg erhwih...", **DO NOT** invent a process like "Analyze Input".
       - **KEEP THE WORDS AS THEY ARE.**
       - **ONLY** fix obvious spelling errors.
       - Example Input: "logn, dshboard" -> Output: ["Login", "Dashboard"]
    
    2. **CASE B: Long Description / Article:**
       - Extract the logical flow (Action -> Result).
       - Summarize into high-level steps.

    [STRICT CONSTRAINTS]
    1. 🛑 **STEP COUNT:** STRICTLY **MAXIMUM 6 STEPS**.
       - If input is longer, you MUST merge or cut.
    
    2. 🛑 **WORD LIMIT:** Each label must be **2 to 4 WORDS MAX**.
    
    3. 🛑 **NO GENERIC FILLER:** Do not use "Start" or "End" as labels unless the user typed them.

    INPUT TEXT:
    {extracted_text}
    """
    
    try:
        response = await client.aio.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=list[DiagramStep],
                temperature=0.1, 
            )
        )
        
        # --- 🛑 STRICT LIMIT: CUT OFF AT 6 STEPS ---
        steps = response.parsed
        if len(steps) > 6:
            # print(f"⚠️ Limit Exceeded: Truncating {len(steps)} steps down to 6.")
            steps = steps[:6]
            
        return steps

    except Exception as e:
        print(f"[ERROR] Model {MODEL_NAME} failed: {e}")
        return []

# --- 4. BRIDGE FUNCTION (Required for main.py) ---
async def get_diagram_labels(text_input: str):
    """
    Wrapper function used by main.py.
    """
    blueprint = await generate_universal_flow(text_input)
    # Extract labels
    labels = [step.label for step in blueprint]
    return labels

# --- MAIN EXECUTION ---
async def main():
    input_filename = "input.txt"
    if os.path.exists(input_filename):
        with open(input_filename, "r", encoding="utf-8") as f:
            extracted_text = f.read()
    else:
        extracted_text = "test input"

    if extracted_text.strip():
        print(f"[DEBUG] 🚀 Analyzing with Strict Limit (Max 6)...")
        blueprint = await generate_universal_flow(extracted_text)
        if blueprint:
            print(json.dumps([step.model_dump() for step in blueprint], indent=2))
        else:
            print("[ERROR] No blueprint generated.")

if __name__ == "__main__":
    asyncio.run(main())