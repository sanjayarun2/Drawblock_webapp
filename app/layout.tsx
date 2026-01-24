import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DrawBlock - Professional Image Processing Tool",
    description: "Transform your images with DrawBlock - the fastest and most accurate image processing tool. 100% free and automatic. No sign-up required.",
    metadataBase: new URL('https://drawblock.app'),
    keywords: ['image processing', 'drawblock', 'image editing', 'photo editor', 'free image tool', 'online image editor'],
    authors: [{ name: 'DrawBlock' }],
    creator: 'DrawBlock',
    publisher: 'DrawBlock',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: 'DrawBlock - Professional Image Processing Tool',
        description: 'Transform your images with DrawBlock - the fastest and most accurate image processing tool. 100% free and automatic.',
        url: 'https://drawblock.app',
        siteName: 'DrawBlock',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'DrawBlock - Professional Image Processing Tool',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DrawBlock - Professional Image Processing Tool',
        description: 'Transform your images with DrawBlock - the fastest and most accurate image processing tool. 100% free and automatic.',
        images: ['/twitter-image.png'],
        creator: '@drawblock',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="theme-color" content="#0D6EFD" />
                <link rel="canonical" href="https://drawblock.app" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "DrawBlock",
                            "url": "https://drawblock.app",
                            "description": "Transform your images with DrawBlock - the fastest and most accurate image processing tool. 100% free and automatic.",
                            "applicationCategory": "MultimediaApplication",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "operatingSystem": "Any",
                            "browserRequirements": "Requires JavaScript. Requires HTML5.",
                        }),
                    }}
                />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
