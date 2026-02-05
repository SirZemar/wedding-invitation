import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG, getFormattedDate } from '@/utils/calendar'
import Countdown from '@/components/common/Countdown'
import HeroImage from '@/assets/HeroImage.jpg'

export default function Hero({ onRSVPClick }) {
  const { t, language } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={HeroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundColor: '#000',
          opacity: 0.2
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl uppercase mb-2 font-light">
          {t('hero.weAreGettingMarried')}
        </h2>
        {/* Subtitle */}
        <p className="text-md md:text-md tracking-widest uppercase mb-4 opacity-90">
          {t('hero.saveTheDate')}
        </p>

        {/* Names */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-4">
          {WEDDING_CONFIG.brideName}
          <span className="block text-3xl md:text-4xl my-2 font-normal italic">&</span>
          {WEDDING_CONFIG.groomName}
        </h1>

        {/* Date */}
        <p className="text-xl md:text-2xl mb-8 tracking-wide">
          {getFormattedDate(WEDDING_CONFIG.weddingDateISO, language)}
        </p>

        {/* Countdown */}
        <div className="mb-12">
          <Countdown />
        </div>

        {/* RSVP Button */}
        <button
          onClick={onRSVPClick}
          className="rsvp-button"
        >
          {t('hero.rsvpButton')}
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
