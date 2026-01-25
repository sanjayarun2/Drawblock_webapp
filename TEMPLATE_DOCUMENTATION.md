# Template Documentation

## Overview
The `templates/` folder contains SVG templates used by the diagram rendering system. These templates define the visual appearance of generated block diagrams.

## Template Structure

### Current Template: `sharp_edge_stable.svg`

This is the main SVG template used for rendering block diagrams. It contains four essential elements:

#### 1. Block Rectangle (`block-rect`)
```xml
<rect id="block-rect" 
      x="90" 
      y="20" 
      width="120" 
      height="80" 
      rx="8" 
      ry="8" 
      fill="#E3F2FF" 
      stroke="#0D6EFD" 
      stroke-width="2"/>
```
- **Purpose**: Template for the rectangular blocks containing labels
- **Styling**: Light blue fill (#E3F2FF) with blue border (#0D6EFD)
- **Corners**: Rounded (8px radius)
- **Size**: 120x80px (dynamically adjusted based on text length)

#### 2. Block Text (`block-text`)
```xml
<text id="block-text" 
      x="150" 
      y="60" 
      text-anchor="middle" 
      dominant-baseline="middle" 
      font-family="Inter, Arial, sans-serif" 
      font-size="16" 
      font-weight="bold" 
      fill="#212529">Label</text>
```
- **Purpose**: Template for text labels inside blocks
- **Font**: Inter or Arial, 16px, bold
- **Color**: Dark gray (#212529)
- **Alignment**: Centered both horizontally and vertically

#### 3. Output Arrow (`output-arrow`)
```xml
<path id="output-arrow" 
      d="M 210 60 L 270 60 M 260 50 L 270 60 L 260 70" 
      fill="none" 
      stroke="#0D6EFD" 
      stroke-width="3" 
      stroke-linecap="round" 
      stroke-linejoin="round"/>
```
- **Purpose**: Arrows connecting blocks from left to right
- **Style**: Blue (#0D6EFD), 3px width
- **Direction**: Points right with arrowhead

#### 4. Input Arrow (`input-arrow`)
```xml
<path id="input-arrow" 
      d="M 30 60 L 90 60 M 80 50 L 90 60 L 80 70" 
      fill="none" 
      stroke="#0D6EFD" 
      stroke-width="3" 
      stroke-linecap="round" 
      stroke-linejoin="round"/>
```
- **Purpose**: Optional arrow at the start of the diagram
- **Style**: Blue (#0D6EFD), 3px width
- **Direction**: Points right into the first block

## How the Renderer Uses the Template

The `renderer.py` module:
1. Loads the SVG template from `templates/sharp_edge_stable.svg`
2. Parses it using Python's `xml.etree.ElementTree`
3. Clones the template elements for each label in the diagram
4. Positions elements horizontally with proper spacing
5. Adjusts block widths based on text length (9 pixels per character + 20px padding)
6. Adds arrows between consecutive blocks
7. Converts the final SVG to PNG using `cairosvg`

## Configuration Constants

In `renderer.py`:
```python
START_X = 90          # Left margin
DEFAULT_WIDTH = 120   # Minimum block width
GAP = 80              # Space between blocks
ARROW_ORIGIN_X = 210  # Arrow starting position
SCALE = 3             # PNG resolution multiplier
CHAR_PX_RATIO = 9     # Pixels per character for width calculation
```

## Testing the Template

Run these tests to verify the template is working correctly:

```python
from renderer import render_diagram

# Basic test
labels = ["Login", "Dashboard", "Logout"]
render_diagram(labels, "output/test.png")

# Complex test
labels = ["Registration", "Verification", "Login", "Dashboard"]
render_diagram(labels, "output/complex_test.png")
```

## Integration Points

### main.py (CLI)
```python
from renderer import render_diagram

# After processing input
if labels:
    output_file = render_diagram(labels)
    print(f"🚀 Done! Open {output_file} to view.")
```

### server.py (Web API)
```python
from renderer import render_diagram

# In the API endpoint
filename = f"diagram_{uuid.uuid4().hex[:8]}.png"
output_path = os.path.join("output", filename)
render_diagram(labels, output_filename=output_path)
```

## Validation Checklist

✅ Template file exists at `templates/sharp_edge_stable.svg`
✅ Contains `<rect id="block-rect">` element
✅ Contains `<text id="block-text">` element
✅ Contains `<path id="output-arrow">` element
✅ Contains `<path id="input-arrow">` element
✅ Template uses proper SVG namespace
✅ Colors match design specifications (#E3F2FF, #0D6EFD, #212529)
✅ Rounded corners are 8px
✅ Font is Inter/Arial, 16px, bold

## Customization

To modify the template appearance:

1. **Colors**: Update `fill` and `stroke` attributes
2. **Size**: Adjust `width`, `height`, `rx`, `ry` attributes
3. **Font**: Change `font-family`, `font-size`, `font-weight`
4. **Arrows**: Modify the `path` `d` attribute for different arrow styles

After making changes, test with:
```bash
python3 -c "from renderer import render_diagram; render_diagram(['Test'], 'output/verify.png')"
```

## Troubleshooting

**Error: Template not found**
- Ensure file exists at `templates/sharp_edge_stable.svg`
- Check file permissions (should be readable)

**Error: Missing required elements**
- Verify all four required IDs are present in the template
- Check SVG namespace is properly declared

**Rendering produces blank/incorrect output**
- Verify cairosvg is installed: `pip install cairosvg`
- Check SVG syntax is valid
- Ensure coordinates and dimensions are positive numbers

## Examples

### Generated Diagram Samples

**Simple Flow:**
```
Input: ["Login", "Dashboard", "Logout"]
```
![Simple Flow](https://github.com/user-attachments/assets/2777ef53-5dfb-4712-b5fa-13c041bf1e29)

**Complex Flow:**
```
Input: ["Registration", "Verification", "Login", "Dashboard"]
```
![Complex Flow](https://github.com/user-attachments/assets/ff34ddde-043f-40f0-9ad9-3f25935cefac)

## Conclusion

The template system provides:
- ✅ Professional, consistent styling
- ✅ Easy customization
- ✅ Reliable rendering
- ✅ Integration with both CLI and web interfaces
- ✅ Scalable output (3x resolution by default)

All template requirements are properly configured and tested!
