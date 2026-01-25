'use client';

import { useState } from 'react';

interface SampleImage {
    id: number;
    src: string;
    alt: string;
}

export default function SampleImages() {
    const [selectedSample, setSelectedSample] = useState<number | null>(null);

    // Sample text inputs - examples users can try
    const sampleTexts: SampleImage[] = [
        { id: 1, src: '', alt: 'User Login Process Flow' },
        { id: 2, src: '', alt: 'Data Pipeline Analytics Dashboard' },
        { id: 3, src: '', alt: 'API Request Response Validation' },
        { id: 4, src: '', alt: 'Frontend Backend Database Integration' },
    ];

    const handleSampleClick = (id: number, text: string) => {
        setSelectedSample(id);
        console.log('Generating diagram for:', text);
        // In production, this would trigger the diagram generation with the sample text
    };

    return (
        <section className="container-custom py-8 pb-16">
            <div className="max-w-2xl mx-auto text-center space-y-6">
                <p className="text-text-secondary body-md">
                    No image?{' '}
                    <span className="font-medium text-text-primary">Try one of these:</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sampleTexts.map((sample) => (
                        <button
                            key={sample.id}
                            onClick={() => handleSampleClick(sample.id, sample.alt)}
                            className={`
                group relative p-6 rounded-lg overflow-hidden
                border-2 transition-all duration-300 text-left
                ${selectedSample === sample.id
                                    ? 'border-primary shadow-card-hover bg-primary-50'
                                    : 'border-background-tertiary hover:border-primary/50 hover:shadow-card bg-white'
                                }
              `}
                        >
                            <div className="flex items-start gap-3">
                                <svg
                                    className={`w-6 h-6 flex-shrink-0 transition-colors ${selectedSample === sample.id ? 'text-primary' : 'text-primary-400'
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <div>
                                    <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                                        {sample.alt}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">Click to generate diagram</p>
                                </div>
                            </div>
                        </button>
                    ))}                  </div>

                {/* Footer Text */}
                <div className="pt-8 text-sm text-text-light space-y-2">
                    <p>
                        By uploading an image or URL you agree to our{' '}
                        <a href="/terms" className="text-primary hover:underline">
                            Terms of Service
                        </a>
                        .
                    </p>
                    <p>
                        To learn more about how we handle your files, view our{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
