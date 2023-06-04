import fr from './locales/fr'
import en from './locales/en'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  langDir: 'locales/',
  messages: {
    fr,
    en
  }
}))
