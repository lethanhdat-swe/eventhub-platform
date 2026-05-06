/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
    animationDelay: {
      0:   '0s',
      80:  '0.08s',
      160: '0.16s',
      240: '0.24s',
      320: '0.32s',
      400: '0.4s',
      480: '0.48s',
    }
  },
  },
  plugins: [],
};
