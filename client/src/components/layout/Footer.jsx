import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG, getFormattedDate } from '@/utils/calendar'

export default function Footer() {
  const { t, language } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 bg-gray-50 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <p className="font-serif text-2xl text-text-primary mb-2">
          {WEDDING_CONFIG.brideName} & {WEDDING_CONFIG.groomName}
        </p>
        <p className="text-text-secondary text-sm">
          {getFormattedDate(WEDDING_CONFIG.weddingDateISO, language)}
        </p>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-text-secondary text-xs">
            {t('footer.madeWithLove')} ❤️ {currentYear}
          </p>
        </div>
      </div>
    </footer>
  )
}
