import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG } from '@/utils/calendar'

export default function OutroSection() {
  const { t } = useLanguage()

  return (
    <section className="section bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto text-center">
        {/* Decorative line */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent w-full max-w-md"></div>
        </div>

        {/* Message */}
        <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-6 font-light">
          {t('outro.message')}
        </p>

        {/* Decorative line */}
        <div className="flex items-center justify-center mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent w-full max-w-md"></div>
        </div>
      </div>
    </section>
  )
}
