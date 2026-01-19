const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: '#0070F3',
            foreground: '#FFFFFF',
          },
          focus: '#0070F3',
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: '#0070F3',
            foreground: '#FFFFFF',
          },
          focus: '#0070F3',
        },
      },
    },
  })],
}
