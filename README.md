# DrawBlock.app

A modern, SEO-optimized web application for image processing built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ✨ **Modern UI**: Beautiful, responsive design inspired by industry-leading tools
- 🚀 **Lightning Fast**: Built with Next.js 14 for optimal performance
- 🔍 **SEO Optimized**: Comprehensive meta tags, Open Graph, structured data, and sitemap
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Premium Design**: Gradient text, smooth animations, and micro-interactions
- 🔌 **Backend Ready**: API routes ready for Python backend integration
- ♿ **Accessible**: WCAG compliant with semantic HTML

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- (Optional) Python backend for image processing

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
drawblock-app/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # File upload API endpoint
│   ├── globals.css               # Global styles and Tailwind
│   ├── layout.tsx                # Root layout with SEO metadata
│   ├── page.tsx                  # Home page
│   ├── robots.ts                 # Robots.txt configuration
│   └── sitemap.ts                # Dynamic sitemap
├── components/
│   ├── Header.tsx                # Navigation header
│   ├── Hero.tsx                  # Hero section
│   ├── SampleImages.tsx          # Sample images grid
│   └── UploadArea.tsx            # File upload component
├── public/                       # Static assets
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Integrating Python Backend

The frontend is ready to connect to your Python backend. Here's how:

### 1. Set up environment variable

Create a `.env.local` file:
```env
PYTHON_BACKEND_URL=http://localhost:8000
```

### 2. Update the upload route

The API route at `app/api/upload/route.ts` has commented code showing how to forward requests to your Python backend. Simply uncomment and adjust as needed.

### Example Python Backend (FastAPI)

```python
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process")
async def process_image(file: UploadFile = File(...)):
    # Your image processing logic here
    return {
        "success": True,
        "processed_url": "...",
        # Return your processed result
    }
```

## SEO Features

This application includes comprehensive SEO optimization:

- ✅ Dynamic metadata with Next.js 14 Metadata API
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD) for search engines
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Semantic HTML structure
- ✅ Fast page load times
- ✅ Mobile-friendly responsive design

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    DEFAULT: '#0D6EFD', // Change this to your brand color
    // ...
  },
}
```

### Content

- Update page title and description in `app/layout.tsx`
- Modify hero text in `components/Hero.tsx`
- Customize navigation items in `components/Header.tsx`

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Digital Ocean
- Your own Node.js server

## License

MIT

## Support

For support, email support@drawblock.app or open an issue.
