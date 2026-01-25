import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // TODO: Forward to Python backend
        // Example implementation for when you add your Python backend:
        /*
        const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
        
        const backendFormData = new FormData();
        backendFormData.append('file', file);
        
        const response = await fetch(`${pythonBackendUrl}/api/process`, {
          method: 'POST',
          body: backendFormData,
        });
        
        if (!response.ok) {
          throw new Error('Backend processing failed');
        }
        
        const result = await response.json();
        return NextResponse.json(result);
        */

        // Temporary mock response
        return NextResponse.json({
            success: true,
            message: 'File received successfully',
            filename: file.name,
            size: file.size,
            type: file.type,
            // When you add your Python backend, return the processed result here
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to process upload' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
