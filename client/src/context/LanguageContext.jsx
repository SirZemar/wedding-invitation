import { createContext, useState, useEffect } from 'react'
import ptTranslations from '../locales/pt.json'
import enTranslations from '../locales/en.json'
import ukTranslations from '../locales/uk.json'

const translations = {
  pt: ptTranslations,
  en: enTranslations,
  uk: ukTranslations
}

const SUPPORTED_LANGUAGES = ['pt', 'en', 'uk']
const DEFAULT_LANGUAGE = 'pt'

export const LanguageContext = createContext()

function detectBrowserLanguage() {
  const browserLang = navigator.language.split('-')[0]
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then browser language
    const stored = localStorage.getItem('wedding-language')
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored
    }
    return detectBrowserLanguage()
  })

  useEffect(() => {
    localStorage.setItem('wedding-language', language)
    document.documentElement.lang = language
  }, [language])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return value || key
  }

  const changeLanguage = (lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguage(lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}
