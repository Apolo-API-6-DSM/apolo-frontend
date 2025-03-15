import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';


const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                neutral: {
                    100: "#FFF2D4",
                    "100-10%": "hsla(40, 100%, 92%, 0.1)",
                    200: "#FFE2A8",
                    300: "#FFCB70",
                    400: "#FFA937",
                    500: "#FF8A05",
                    600: "#F07306",
                    700: "#C75607",
                    800: "#9E440E",
                },
                primary: {
                    100: "#E6F6FF",
                    200: "#BAE3FF",
                    300: "#7CC4FA",
                    400: "#47A3F3",
                    500: "#2186EB",
                    600: "#0967D2",
                    700: "#0552B5",
                    800: "#03449E",
                },
                accent: "F03906",
                success: "22C55E",
                error: "DC2626",
                warning: "FFCE52",
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                "small": "14px",
                "base": "16px",
                "large": "18px",
                "heading4": "30px",
                "heading3": "40px",
                "heading2": "50px",
                "heading1": "60px",
                "button": "14px"
            }
        },
    },
    plugins: [],
};
export default config;