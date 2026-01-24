'use client';

import { useState, useRef } from 'react';

export default function TextInputArea() {
    const [inputText, setInputText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            alert('Please enter some text to generate a diagram');
            return;
        }

        setIsGenerating(true);

        // Simulate processing - in production, this calls your Python backend
        setTimeout(() => {
            generateDiagram(inputText);
            setIsGenerating(false);
        }, 1500);
    };

    const generateDiagram = (text: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 800;
        // Generate diagram logic
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const items = text.split(/[\s,\n]+/).filter(item => item.trim());
        const boxWidth = 200;
        const boxHeight = 80;
        const spacing = 60;

        canvas.width = 800; // Fixed width
        canvas.height = Math.max(600, 100 + items.length * (boxHeight + spacing)); // Dynamic height for vertical Stack

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const startX = (canvas.width - boxWidth) / 2;
        const startY = 50;

        items.forEach((item, index) => {
            const x = startX;
            const y = startY + index * (boxHeight + spacing);

            if (index > 0) {
                const prevY = startY + (index - 1) * (boxHeight + spacing);

                // Vertical connector
                ctx.strokeStyle = '#0D6EFD';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x + boxWidth / 2, prevY + boxHeight);
                ctx.lineTo(x + boxWidth / 2, y);
                ctx.stroke();

                // Arrow head
                const arrowX = x + boxWidth / 2;
                const arrowY = y;

                ctx.beginPath();
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX - 6, arrowY - 10);
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX + 6, arrowY - 10);
                ctx.stroke();
            }

            // Draw Box
            ctx.fillStyle = '#E3F2FF';
            ctx.strokeStyle = '#0D6EFD';
            ctx.lineWidth = 2;
            ctx.beginPath();
            // @ts-ignore - roundRect is new in some envs
            if (ctx.roundRect) {
                ctx.roundRect(x, y, boxWidth, boxHeight, 8);
            } else {
                ctx.rect(x, y, boxWidth, boxHeight);
            }
            ctx.fill();
            ctx.stroke();

            // Draw Text
            ctx.fillStyle = '#212529';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const maxWidth = boxWidth - 20;
            const words = item.split(' ');
            let line = '';
            const lines: string[] = [];

            words.forEach(word => {
                const testLine = line + word + ' ';
                if (ctx.measureText(testLine).width > maxWidth && line !== '') {
                    lines.push(line);
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            });
            lines.push(line);

            const lineHeight = 20;
            const textY = y + boxHeight / 2 - ((lines.length - 1) * lineHeight) / 2;

            lines.forEach((line, i) => {
                ctx.fillText(line.trim(), x + boxWidth / 2, textY + i * lineHeight);
            });
        });

        const dataUrl = canvas.toDataURL('image/png');
        setDiagramUrl(dataUrl); // Changed from setPreviewUrl to setDiagramUrl

        // Scroll to preview
        setTimeout(() => {
            const preview = document.getElementById('preview-section');
            if (preview) {
                preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    };

    const roundRect = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    };

    const handleDownload = () => {
        if (!diagramUrl) return;

        const link = document.createElement('a');
        link.download = 'block-diagram.png';
        link.href = diagramUrl;
        link.click();
    };

    return (
        <section className="container-custom py-12">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Input Area */}
                <div className="card p-8">
                    <div className="space-y-4">
                        <label htmlFor="textInput" className="block text-lg font-semibold text-text-primary">
                            Enter your description, URL, or text
                        </label>
                        <textarea
                            id="textInput"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="e.g., User Login Authentication Database Response Success&#10;or: https://example.com/process&#10;or: Step1 Step2 Step3 Process Complete"
                            className="w-full h-32 px-4 py-3 border-2 border-background-tertiary rounded-lg focus:border-primary focus:outline-none transition-colors resize-none text-text-primary"
                        />

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="btn-primary w-full sm:w-auto"
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                'Generate Diagram'
                            )}
                        </button>
                    </div>
                </div>

                {/* Hidden Canvas for Generation */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Preview Area */}
                {diagramUrl && (
                    <div className="card p-8 space-y-6 animate-scale-in">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-text-primary">Your Block Diagram</h3>
                            <button
                                onClick={handleDownload}
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download PNG
                            </button>
                        </div>

                        <div className="bg-background-secondary rounded-lg p-4 border border-background-tertiary">
                            <img
                                src={diagramUrl}
                                alt="Generated block diagram"
                                className="w-full h-auto rounded"
                            />
                        </div>

                        <p className="text-sm text-text-secondary text-center">
                            Click "Download PNG" to save your diagram
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
