'use client';

import { useState, useCallback, useRef } from 'react';

export default function UploadArea() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const processFile = async (file: File) => {
        setUploadedFile(file);
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            console.log('File processed:', data);

            // You can add additional logic here to handle the response
            // For example, if the backend returns a processed image URL:
            // if (data.processed_url) { ... }

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    processFile(file);
                }
            }
        }
    }, []);

    return (
        <section className="container-custom py-12">
            <div className="max-w-2xl mx-auto">
                <div
                    className={`upload-area ${isDragging ? 'drag-active' : ''} ${isProcessing ? 'opacity-75 pointer-events-none' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    tabIndex={0}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />

                    {isProcessing ? (
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
                            <p className="text-text-secondary font-medium">Processing your image...</p>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleUploadClick}
                                className="btn-primary text-lg px-8 py-4"
                            >
                                Upload Image
                            </button>

                            <div className="text-center space-y-2">
                                <p className="text-text-secondary body-md">
                                    or drop a file,{' '}
                                    <button
                                        onClick={handleUploadClick}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        paste image
                                    </button>
                                    {' '}or{' '}
                                    <button className="text-primary hover:underline font-medium">
                                        URL
                                    </button>
                                </p>
                            </div>

                            {uploadedFile && (
                                <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200 animate-scale-in">
                                    <p className="text-sm text-primary-700 font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {uploadedFile.name}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
