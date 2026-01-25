# Frontend-Backend API Connection Flow Documentation

## Overview
This document explains how the frontend and backend connect via API when the "Generate" button is clicked in the Drawblock webapp.

---

## Architecture Summary

**Frontend:** Next.js/React (TypeScript) + Plain HTML/JavaScript
**Backend:** Python FastAPI
**Communication:** REST API (JSON)

---

## Complete Flow: Generate Button Click → Diagram Generation

### 1. **Frontend (User Action)**

#### Location: `/static/index.html` (Lines 371-378)
```javascript
generateBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
        alert('Please enter some text to generate a diagram');
        return;
    }
    callBackend(text);
});
```

**What happens:**
- User enters text in the input field (can be: URL, description, or comma-separated list)
- User clicks the "Generate Diagram" button
- The input is validated (not empty)
- `callBackend()` function is invoked with the input text

---

### 2. **Frontend (API Call)**

#### Location: `/static/index.html` (Lines 337-341)
```javascript
const response = await fetch("/generate-diagram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: inputText })
});
```

**What happens:**
- Makes a POST request to `/generate-diagram` endpoint
- Sends JSON payload: `{ "data": "user input text" }`
- Shows loading state: "⏳ Generating..."

---

### 3. **Backend (API Endpoint)**

#### Location: `/server.py` (Lines 50-51)
```python
@app.post("/generate-diagram")
async def generate_api(request: RequestData):
    user_input = request.data.strip()
```

**What happens:**
- FastAPI receives the POST request
- Extracts the `data` field from JSON payload
- Begins processing the input

---

### 4. **Backend (Input Classification)**

#### Location: `/server.py` (Lines 62-76)

The backend intelligently classifies the input into 3 cases:

**CASE A: URL Input**
```python
if is_url(user_input):
    print("👉 Detected URL input.")
    content = fetch_web_content(user_input)  # scraper.py
    if content:
        labels = await get_diagram_labels(content)  # ai_engine.py
```
- Scrapes web content using `trafilatura`
- Sends content to Gemini AI to extract logical steps

**CASE B: Explicit List (Comma/newline separated)**
```python
elif is_explicit_list(user_input):
    print("👉 Detected Explicit List.")
    labels = [x.strip() for x in re.split(r'[,\n]+', user_input) if x.strip()]
```
- Direct parsing, **NO AI** used
- Splits by commas/newlines

**CASE C: Description/Prompt**
```python
else:
    print("👉 Detected Text Description.")
    labels = await get_diagram_labels(user_input)  # ai_engine.py
```
- Sends to Gemini AI for semantic extraction

---

### 5. **AI Processing (if needed)**

#### Location: `/ai_engine.py` (Lines 77-84)
```python
async def get_diagram_labels(text_input: str):
    blueprint = await generate_universal_flow(text_input)
    labels = [step.label for step in blueprint]
    return labels
```

**What happens:**
- Sends prompt to Google Gemini 2.5 Flash Lite model
- Gemini extracts maximum 6 logical steps
- Returns structured list of labels (2-4 words each)

---

### 6. **Diagram Rendering**

#### Location: `/renderer.py` (Lines 18-83)
```python
def render_diagram(labels: list, output_filename="output/final_diagram.png"):
    # Reads SVG template
    # Dynamically creates blocks for each label
    # Adds arrows between blocks
    # Converts SVG to PNG using cairosvg
    return output_filename
```

**What happens:**
- Loads SVG template (`templates/sharp_edge_stable.svg`)
- Generates blocks and arrows based on labels
- Saves as PNG in `/output/` directory with unique filename

---

### 7. **Backend (Response)**

#### Location: `/server.py` (Lines 88-92)
```python
return {
    "status": "success", 
    "image_url": f"/output/{filename}", 
    "steps": labels
}
```

**What happens:**
- Returns JSON response with:
  - `status`: "success"
  - `image_url`: Path to generated PNG (e.g., "/output/diagram_a1b2c3d4.png")
  - `steps`: Array of labels used

---

### 8. **Frontend (Display Result)**

#### Location: `/static/index.html` (Lines 345-353)
```javascript
if (response.ok) {
    // SUCCESS: Update Image Source with URL from backend
    diagramPreview.src = data.image_url;
    
    // Show Result Area
    previewArea.classList.remove('hidden');
    
    // Scroll to result
    previewArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
```

**What happens:**
- Updates `<img>` src with the returned URL
- Shows preview area (was hidden)
- Auto-scrolls to the diagram
- Enables download button

---

## API Specification

### Endpoint
```
POST /generate-diagram
```

### Request
```json
{
  "data": "Login, Verify OTP, Dashboard, Logout"
}
```

### Response (Success)
```json
{
  "status": "success",
  "image_url": "/output/diagram_a1b2c3d4.png",
  "steps": ["Login", "Verify OTP", "Dashboard", "Logout"]
}
```

### Response (Error)
```json
{
  "detail": "Could not extract steps"
}
```
HTTP Status: 400 or 500

---

## File Serving

The generated PNG files are served statically:

#### Location: `/server.py` (Line 29)
```python
app.mount("/output", StaticFiles(directory="output"), name="output")
```

This means:
- Backend saves: `output/diagram_abc123.png`
- Frontend accesses: `http://localhost:8000/output/diagram_abc123.png`

---

## Key Technologies Used

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | HTML/JavaScript | User interface, API calls |
| Frontend Framework | Next.js/React | Modern UI components |
| Backend | Python FastAPI | REST API server |
| AI Model | Google Gemini 2.5 Flash Lite | Extract logical steps from text |
| Web Scraper | Trafilatura + BeautifulSoup | Extract content from URLs |
| SVG Rendering | xml.etree + cairosvg | Generate diagram images |

---

## Error Handling

### Frontend
- Validates empty input
- Shows error alert if backend fails
- Handles network errors gracefully

### Backend
- Returns HTTP 400 if no steps can be extracted
- Returns HTTP 500 for server errors
- Logs all errors to console

---

## Example User Flows

### Flow 1: URL Input
```
1. User enters: "https://example.com/login-process"
2. Frontend sends: {"data": "https://example.com/login-process"}
3. Backend scrapes the URL content
4. AI extracts: ["Enter Credentials", "Validate", "Generate Token", "Redirect"]
5. Renderer creates diagram PNG
6. Frontend displays the image
```

### Flow 2: Comma-Separated List
```
1. User enters: "Start, Process, Validate, End"
2. Frontend sends: {"data": "Start, Process, Validate, End"}
3. Backend splits by comma (NO AI)
4. Renderer creates diagram PNG
5. Frontend displays the image
```

### Flow 3: Natural Language
```
1. User enters: "The user logs in, system verifies credentials, if valid shows dashboard otherwise shows error"
2. Frontend sends: {"data": "..."}
3. AI extracts: ["User Login", "Verify Credentials", "Show Dashboard"]
4. Renderer creates diagram PNG
5. Frontend displays the image
```

---

## Notes

1. **React Component (`TextInputArea.tsx`) vs HTML:**
   - The Next.js React component currently generates diagrams **client-side only** (line 26: `generateDiagram()`)
   - The production version uses `/static/index.html` which **calls the backend API**
   - The React component does NOT connect to the backend yet (line 19 comment: "in production, this calls your Python backend")

2. **API Key Exposure:**
   - The Gemini API key is hardcoded in `ai_engine.py` (line 11)
   - Should be moved to environment variables for security

3. **CORS Enabled:**
   - Backend allows all origins (`allow_origins=["*"]`)
   - Safe for development, should be restricted in production

---

## Summary

When the Generate button is clicked:

1. **Frontend captures** user input
2. **Frontend sends** POST request to `/generate-diagram` with JSON payload
3. **Backend receives** and classifies input (URL/List/Description)
4. **Backend processes** using scraper/AI as needed
5. **Backend renders** diagram as PNG file
6. **Backend responds** with JSON containing image URL
7. **Frontend displays** the generated diagram image
8. **User can download** the PNG file

The connection is a simple REST API using JSON over HTTP, with intelligent input processing on the backend.
