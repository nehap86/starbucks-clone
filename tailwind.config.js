/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'starbucks-green': '#00704A',
                'starbucks-dark': '#1E3932',
                'starbucks-light': '#D4E9E2',
                'starbucks-bg': '#F2F0EB',
                'starbucks-gold': '#CBA258',
                'starbucks-accent': '#00754a', // Hover state
            },
            fontFamily: {
                sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
