const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        cinzel: ['Cinzel', 'serif'],
      },

      keyframes: {
        leftToRight: {
          '0%': { transform: 'translateX(1em) translateY(0.5em)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1  },
        },
        rightToLeft: {
          '0%': { transform: 'translateX(0)', opacity: 0 },
          '100%': { transform: 'translateX(1em) translateY(0.5em)', opacity: 1  },
        }
      },

      animation: {
        leftToRight: 'leftToRight 1s cubic-bezier(0.33, 1, 0.68, 1) forwards',
        rightToLeft: 'rightToLeft 1s cubic-bezier(0.33, 1, 0.68, 1) forwards',
      }

    },
	},
	plugins: [],
}
