
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
      }
    }
  }
}
