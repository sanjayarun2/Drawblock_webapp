import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0D6EFD',
                    50: '#E3F2FF',
                    100: '#CCE5FF',
                    200: '#99CCFF',
                    300: '#66B2FF',
                    400: '#3399FF',
                    500: '#0D6EFD',
                    600: '#0A58CA',
                    700: '#084298',
                    800: '#052C65',
                    900: '#031633',
                },
                background: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#F8F9FA',
                    tertiary: '#E9ECEF',
                },
                text: {
                    primary: '#212529',
                    secondary: '#6C757D',
                    light: '#ADB5BD',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 2px 16px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 24px rgba(0, 0, 0, 0.12)',
                'button': '0 2px 8px rgba(13, 110, 253, 0.3)',
            },
            borderRadius: {
                'card': '12px',
                'button': '8px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
