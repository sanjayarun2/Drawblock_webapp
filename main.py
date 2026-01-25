import asyncio
import os
import re
from scraper import fetch_web_content
from ai_engine import get_diagram_labels
from renderer import render_diagram

def is_url(string):
    """Simple check to see if input is a URL."""
    return string.startswith("http://") or string.startswith("https://")

def is_explicit_list(string):
    """
    Checks if the user gave a direct comma/newline separated list.
    Example: "Login, Verify, Dashboard"
    """
    if "\n" in string or "," in string:
        # Heuristic: If it's short and has delimiters, it's likely a list
        # If it's very long (like a paragraph), it needs AI parsing
        if len(string.split()) < 30: 
            return True
    return False

async def main_pipeline():
    print("--- 🟦 BLOCK DIAGRAM GENERATOR 🟦 ---")
    user_input = input("📝 Enter URL, Description, or List: ").strip()
    
    if not user_input:
        print("❌ Empty input.")
        return

    extracted_content = ""
    labels = []

    # --- PHASE 1: INPUT ANALYSIS ---
    
    # CASE A: User entered a URL
    if is_url(user_input):
        print("👉 Detected URL input.")
        extracted_content = fetch_web_content(user_input)
        if not extracted_content:
            return
        # Pass website content to AI to get logical steps
        labels = await get_diagram_labels(extracted_content)

    # CASE B: User entered an Explicit List (Comma/Space separated)
    # "If user directly give what should be in block diagram"
    elif is_explicit_list(user_input) and " " not in user_input.strip().replace(",", ""):
        # If it's JUST words separated by commas, skip AI to follow instruction strictly
        print("👉 Detected Explicit List (Skipping AI extraction).")
        # Split by comma or newline
        labels = [x.strip() for x in re.split(r'[,\n]+', user_input) if x.strip()]
        
    # CASE C: User entered a Description/Prompt
    else:
        print("👉 Detected Text Description.")
        extracted_content = user_input
        # Pass description to AI to abstract the flow
        labels = await get_diagram_labels(extracted_content)

    # --- PHASE 2: GENERATION ---
    
    if labels:
        print(f"\n📋 Generated Steps ({len(labels)}): {labels}")
        output_file = render_diagram(labels)
        print(f"🚀 Done! Open {output_file} to view.")
    else:
        print("❌ Could not generate steps from input.")

if __name__ == "__main__":
    asyncio.run(main_pipeline())