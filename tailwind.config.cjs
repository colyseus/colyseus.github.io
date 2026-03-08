const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Trajan Pro', ...defaultTheme.fontFamily.serif],
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-down': 'fadeDown 0.3s ease-out both',
        'scale-in': 'scaleIn 0.3s ease-out both',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scaleX(0)' },
          '100%': { opacity: '1', transform: 'scaleX(1)' },
        },
      },

    },
	},
	plugins: [],
}
