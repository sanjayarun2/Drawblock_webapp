# Frontend-Backend API Connection Analysis

## Quick Summary

This repository contains a **Drawblock web application** that generates block diagrams from text input. Here's how the frontend and backend connect when the "Generate" button is clicked:

### The Flow in 30 Seconds:

1. **User Action**: User enters text → clicks "Generate Diagram" button
2. **Frontend**: JavaScript sends POST request to `/generate-diagram` with JSON payload
3. **Backend**: FastAPI receives request → classifies input (URL/List/Description)
4. **Processing**: 
   - If URL: Scrapes content → AI extracts steps
   - If comma-separated list: Direct parsing (no AI)
   - If description: AI extracts steps
5. **Rendering**: Python creates PNG diagram from steps
6. **Response**: Backend returns JSON with image URL
7. **Display**: Frontend shows the generated diagram image

---

## Documentation Files

### 📄 [API_CONNECTION_DOCUMENTATION.md](./API_CONNECTION_DOCUMENTATION.md)
**Comprehensive technical documentation** covering:
- Complete step-by-step flow
- Code snippets from actual files
- API specification (request/response formats)
- Error handling
- Example user flows
- Technology stack details

### 📊 [ARCHITECTURE_FLOW.txt](./ARCHITECTURE_FLOW.txt)
**Visual ASCII diagram** showing:
- Request/response flow
- Decision tree for input classification
- Component interactions
- Key technologies used
- API endpoint details

---

## Key Technologies

| Component | Technology | File |
|-----------|-----------|------|
| **Backend API** | Python FastAPI | `server.py` |
| **AI Processing** | Google Gemini 2.5 Flash Lite | `ai_engine.py` |
| **Web Scraping** | Trafilatura + BeautifulSoup | `scraper.py` |
| **Diagram Rendering** | cairosvg + XML | `renderer.py` |
| **Frontend** | HTML/JavaScript, Next.js/React | `static/index.html`, `static/components/` |

---

## The API Endpoint

### Request
```bash
POST /generate-diagram
Content-Type: application/json

{
  "data": "Login, Verify OTP, Dashboard, Logout"
}
```

### Response
```json
{
  "status": "success",
  "image_url": "/output/diagram_a1b2c3d4.png",
  "steps": ["Login", "Verify OTP", "Dashboard", "Logout"]
}
```

---

## How Input is Processed

The backend intelligently handles 3 types of input:

### 1. **URL Input**
```
Input: "https://example.com/login-flow"
→ Scrapes webpage content
→ AI extracts logical steps
→ Generates diagram
```

### 2. **Comma-Separated List** (Direct)
```
Input: "Login, Verify, Dashboard, Logout"
→ Splits by commas (NO AI)
→ Generates diagram
```

### 3. **Natural Language Description**
```
Input: "User logs in, system verifies credentials and shows dashboard"
→ AI extracts logical steps
→ Generates diagram
```

---

## Code Locations

### Frontend (Generate Button Click)
- **HTML Version**: `/static/index.html` (Lines 371-378, 337-353)
- **React Version**: `/static/components/TextInputArea.tsx` (Lines 11-24)
  - *Note: React version currently generates client-side only, not connected to backend*

### Backend (API Handler)
- **Main Server**: `/server.py` (Lines 50-98)
- **Input Classification**: `/server.py` (Lines 62-76)
- **AI Processing**: `/ai_engine.py` (Lines 77-84, 23-74)
- **Web Scraping**: `/scraper.py` (Lines 4-32)
- **Diagram Rendering**: `/renderer.py` (Lines 18-83)

---

## Running the Application

### Start Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python server.py
# or
uvicorn server:app --host 0.0.0.0 --port 8000
```

### Access Frontend
```
Open browser: http://localhost:8000
```

The FastAPI server serves both:
- The API endpoint: `/generate-diagram`
- Static files: `/static/` (frontend HTML/JS/CSS)
- Generated images: `/output/` (diagram PNGs)

---

## Important Notes

1. **Two Frontend Versions**:
   - `static/index.html`: Production-ready, **connects to backend**
   - `static/components/TextInputArea.tsx`: React component, **client-side only** (doesn't call backend yet)

2. **API Key Security**:
   - Gemini API key is hardcoded in `ai_engine.py` line 11
   - Should be moved to environment variables for production

3. **CORS Configuration**:
   - Currently allows all origins (`allow_origins=["*"]`)
   - Should be restricted in production

---

## Example Flow Trace

When user enters "Login, Verify, Dashboard" and clicks Generate:

```
1. index.html:371      → generateBtn.addEventListener('click')
2. index.html:337      → fetch("/generate-diagram", {POST})
3. server.py:51        → @app.post("/generate-diagram")
4. server.py:69        → Detects explicit list
5. server.py:71        → labels = ["Login", "Verify", "Dashboard"]
6. renderer.py:18      → render_diagram(labels)
7. renderer.py:81      → Save PNG to output/diagram_abc123.png
8. server.py:88        → return {image_url: "/output/diagram_abc123.png"}
9. index.html:347      → diagramPreview.src = data.image_url
10. Browser            → Displays the generated diagram
```

---

## Questions?

Both documentation files provide extensive details:
- **API_CONNECTION_DOCUMENTATION.md**: Text-based comprehensive guide
- **ARCHITECTURE_FLOW.txt**: Visual flowchart with ASCII art

For code implementation details, refer to the source files mentioned above.
