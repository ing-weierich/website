module.exports = {
  content: ["./templates/**/*.html", "./public/js/**/*.js"],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    extend: {
      colors: {
        blue: "#02324D",
        black: "#011019",
        grey: "#f0f0f0",
      },
      fontFamily: {
        headline: ["Spartan", "sans-serif"],
      },
    },
  },
  plugins: [],
};
