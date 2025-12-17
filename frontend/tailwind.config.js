import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        70: "280px",
      },
      margin: {
        70: "280px",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["emerald", "dark", "light"],
    darkTheme: "dark",
  },
};
