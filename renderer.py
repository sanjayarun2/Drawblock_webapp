import xml.etree.ElementTree as ET
import copy
import cairosvg
import os
import textwrap

# Constants
SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)
NS = {"svg": SVG_NS}

START_X = 90
DEFAULT_WIDTH = 120
GAP = 80
ARROW_ORIGIN_X = 210
SCALE = 3
CHAR_PX_RATIO = 9 

def render_diagram(labels: list, output_filename="output/final_diagram.png"):
    """Generates PNG from a list of strings."""
    
    input_svg = "templates/sharp_edge_stable.svg"
    
    if not os.path.exists(input_svg):
        print(f"❌ Error: Template {input_svg} not found.")
        return

    tree = ET.parse(input_svg)
    root_tpl = tree.getroot()

    # Get Templates
    rect_tpl = root_tpl.find(".//svg:rect[@id='block-rect']", NS)
    text_tpl = root_tpl.find(".//svg:text[@id='block-text']", NS)
    arrow_tpl = root_tpl.find(".//svg:path[@id='output-arrow']", NS)
    input_arrow_tpl = root_tpl.find(".//svg:path[@id='input-arrow']", NS)

    # Initialize New SVG
    root = ET.Element(f"{{{SVG_NS}}}svg", root_tpl.attrib)
    if input_arrow_tpl is not None:
        root.append(copy.deepcopy(input_arrow_tpl))
    
    current_x = START_X

    # Build Diagram
    for i, label_text in enumerate(labels):
        # --- FIX: Wrap text and calculate dynamic width only if necessary ---
        
        # Calculate max characters per line to fit in DEFAULT_WIDTH (minus 20px padding)
        max_chars = int((DEFAULT_WIDTH - 20) / CHAR_PX_RATIO)
        
        # Wrap text; break_long_words=False ensures we only expand box if a single word is huge
        lines = textwrap.wrap(label_text, width=max_chars, break_long_words=False)
        
        # Determine width based on the longest line (effectively clamps to DEFAULT_WIDTH unless forced)
        longest_line_len = max(len(line) for line in lines) if lines else 0
        block_width = max(DEFAULT_WIDTH, (longest_line_len * CHAR_PX_RATIO) + 20)

        # Block
        block = copy.deepcopy(rect_tpl)
        block.attrib.update({"x": str(current_x), "width": str(block_width)})
        root.append(block)

        # Label (Multi-line handling)
        lbl = copy.deepcopy(text_tpl)
        lbl_center_x = current_x + block_width / 2
        lbl.attrib.update({"x": str(lbl_center_x)})
        
        # Clear default text and use tspans
        lbl.text = "" 
        line_height = 14 # Pixels between lines
        
        # Calculate start shift to keep block vertically centered
        # If 1 line, shift is 0. If 3 lines, shift up by 1 line height.
        start_dy = -((len(lines) - 1) * line_height) / 2
        
        for j, line in enumerate(lines):
            tspan = ET.Element(f"{{{SVG_NS}}}tspan")
            tspan.text = line
            tspan.set("x", str(lbl_center_x)) # Align to center of box
            
            if j == 0:
                tspan.set("dy", str(start_dy)) # Initial vertical offset
            else:
                tspan.set("dy", str(line_height)) # Next lines shift down
            
            lbl.append(tspan)
            
        root.append(lbl)
        # ------------------------------------------------------------------

        # Arrow
        if i < len(labels) - 1:
            arrow = copy.deepcopy(arrow_tpl)
            shift = (current_x + block_width) - ARROW_ORIGIN_X
            arrow.set("transform", f"translate({shift}, 0)")    
            root.append(arrow)
            current_x += block_width + GAP
        else:
            current_x += block_width

    # Resize Canvas
    canvas_w = current_x + 100 
    root.attrib.update({
        "viewBox": f"0 0 {canvas_w} 120",
        "width": str(canvas_w * SCALE),
        "height": str(120 * SCALE),
        "preserveAspectRatio": "xMinYMin meet"
    })

    # Save
    if not os.path.exists("output"):
        os.makedirs("output")
        
    cairosvg.svg2png(bytestring=ET.tostring(root), write_to=output_filename)
    print(f"✅ Diagram saved to: {output_filename}")
    return output_filename