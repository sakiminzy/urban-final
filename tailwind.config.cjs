/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Instrument Sans", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      fontSize: {
        "display-lg": "60px",
        "display-md": "52px",
        "heading-lg": "44px",
        "heading-md": "28px",
      },
      backgroundColor: {
        "category-badge": "#a6a6a6",
        "image-placeholder": "#ededed",
      },
      borderRadius: {
        "card": "32px",
        "image": "24px",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
