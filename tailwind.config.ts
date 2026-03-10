import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false, // Prevents Tailwind from resetting base styles, preserving current design
    },
    plugins: [],
};

export default config;
