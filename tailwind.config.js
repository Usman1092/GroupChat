/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors:{
      "a":"F7F9F2",
      "bg1": "rgba(143, 224, 230, 1)",
      "bg2": "#7E87D5",
      "bg": "rgba(67, 99, 153, 0.9)",
      "top": "rgba(146, 197, 241, 1)",
      "bottom": "rgba(67, 99, 153, 1)",
      "head": "#757BA1",
      "dbg":"rgba(93, 101, 155, 1)",
      "sfg":"#F5BE60",
     "tb":"#84A2DB",
     "bt":"#F5BE60"
    }
  },
  plugins: [],
}
