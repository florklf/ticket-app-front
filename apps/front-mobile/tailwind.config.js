export default {
  corePlugins: {
    aspectRatio: false
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        textonprimary: 'var(--primary-color-text)',
        text: 'var(--text-color)',
        textsecondary: 'var(--text-secondary-color)',
        surfaceground: 'var(--surface-ground)',
        surfacesection: 'var(--surface-section)',
        surfacecard: 'var(--surface-card)',
        surfaceoverlay: 'var(--surface-overlay)',
        surfaceborder: 'var(--surface-border)',
        surfacehover: 'var(--surface-hover)',
        bghighlight: 'var(--highlight-bg)',
        texthighlight: 'var(--highlight-text-color)'
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        17: '4.25rem',
        18: '4.5rem',
        19: '4.75rem',
        20: '5rem'
      }
    }
  }
}
