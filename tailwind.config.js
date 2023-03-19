module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './dist/popup.html'],
  content: ['./src/**/*.{html,js,tsx}'],
  corePlugins: { preflight: false },
  important: '#popup',
  theme: {
    extend: {},
  },
  plugins: [],
};
