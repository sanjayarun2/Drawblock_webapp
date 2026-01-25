'use client';

import Image from 'next/image';

export default function Hero() {
    return (
        <section className="container-custom py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-6 animate-slide-up">
                    <div className="space-y-4">
                        <h1 className="heading-xl">
                            <span className="gradient-text">Text to</span>
                            <br />
                            Block Diagram
                        </h1>

                        <div className="flex items-center gap-3">
                            <p className="text-xl md:text-2xl text-text-secondary">
                                100% Automatically and
                            </p>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-white font-semibold text-sm shadow-button animate-pulse-soft">
                                Free
                            </span>
                        </div>
                    </div>

                    <p className="body-lg text-text-secondary max-w-xl">
                        Convert any text, blog URL, or article description into professional block diagrams instantly.
                        Perfect for writers, researchers, and journals who want to visualize their content automatically.
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-full border border-background-tertiary">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-medium text-text-primary">Instant Generation</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-full border border-background-tertiary">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            <span className="text-sm font-medium text-text-primary">Auto Layout</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-full border border-background-tertiary">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-text-primary">PNG Download</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Hero Image */}
                <div className="relative h-[400px] md:h-[500px] animate-fade-in">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl animate-float"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-full h-full max-w-md mx-auto">
                            {/* Placeholder for hero image */}
                            <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                                <div className="relative w-full h-full bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
                                    <svg
                                        className="w-32 h-32 text-primary-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
