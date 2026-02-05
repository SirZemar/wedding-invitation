import { useLanguage } from '../../hooks/useLanguage'

const LANGUAGE_LABELS = {
  pt: 'PT',
  en: 'EN',
  uk: 'UK'
}

export default function LanguageSwitcher() {
  const { language, changeLanguage, SUPPORTED_LANGUAGES } = useLanguage()

  return (
    <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-md p-1 shadow-sm">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className={`lang-btn ${language === lang ? 'active' : ''}`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  )
}
