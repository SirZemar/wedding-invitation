import { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

export default function FloatingRSVP({ onClick }) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show floating button after scrolling past the hero section (100vh)
      const heroHeight = window.innerHeight
      setIsVisible(window.scrollY > heroHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <button
      onClick={onClick}
      className="floating-rsvp"
      aria-label={t('hero.rsvpButton')}
    >
      <span className="hidden sm:inline">{t('hero.rsvpButton')}</span>
      <span className="sm:hidden">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </span>
    </button>
  )
}
