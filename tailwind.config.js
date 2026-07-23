/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1E3A1E',        
        'brand-primary-hover': '#142814', 
        'brand-accent': '#D97706',         
        'brand-accent-hover': '#B45309',   
        'bg-primary': '#F3F4F6',          
        'bg-secondary': '#E5E7EB',
        'text-primary': '#111827',
        'text-secondary': '#4B5563',
        'text-tertiary': '#9CA3AF',
        'border-default': '#E5E7EB',
      },
      borderRadius: {
        'radius-sm': '4px',
        'radius-md': '8px',
        'radius-lg': '16px',
      },
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}