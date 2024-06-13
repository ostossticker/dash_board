import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        "insomnia-primary":"#Ef5350",
        "thead-primary":"#005D85",
        "topTitle":"#333333",
        "input-primary":"#96989A",
        "dark-sidebar":"#252c48",
        "dark-bg-color":"#1C2039",
        "dark-box-color":"#262B49",
        "dark-lg-color":"#F0F7FF",
        "dark-md-color":"#B1B6D4",
        "dark-sm-color":"#424664",
        "dark-table-row":"rgb(35 44 97)",
        ///////////////////////color that change later ////////////////
        'menu' : '#1A3A57',
        'mainBlue' : '#1C567D',
        'mainRed' : '#F05658',
        'mainLightBlue' : '#00bcd4',
        'DarkRed' : '#CF4D4B',
        'DarkBlue': '#1D8BA3',
        'mainLightRed': '#ff3333'
      },
      screens: {
        'xs': '375px',    // Extra small screens (mobile phones) 
        'sm': '640px',    // Small screens (tablets)
        'md': '768px',    // Medium screens (small laptops)
        'lg': '1024px',   // Large screens (desktops)
        'xl': '1920px',   // Extra large screens (large desktops)
        '2xl': '2560px',  // 2K monitors
        '4xl': '3840px',  // 4K monitors
        // Add more screen sizes if needed
      },
    },
    
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          
          "primary": "#0005ff",
                   
          "secondary": "#00fe00",
                   
          "accent": "#00bb00",
                   
          "neutral": "#0c0c16",
                   
          "base-100": "#f6fff9",
                   
          "info": "#00e4ff",
                   
          "success": "#00e8a4",
                   
          "warning": "#ff8e00",
                   
          "error": "#c92037",
                   },
      },
    ],
  },
  plugins: [require("tailwind-scrollbar"),require('daisyui')],
};
export default config;
