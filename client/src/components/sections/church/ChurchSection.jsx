import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG, getFormattedDate, getFormattedTime } from '@/utils/calendar'
import MapEmbed from '@/components/common/MapEmbed'
import AddToCalendar from '@/components/common/AddToCalendar'
import ChurchImage from '@/assets/ChurchImage.jpg'

export default function ChurchSection() {
  const { t, language } = useLanguage()

  return (
    <section className="section bg-background" id="ceremony">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title font-serif">{t('ceremony.title')}</h2>

        <p className="text-center text-text-secondary mb-8 max-w-2xl mx-auto">
          {t('ceremony.introduction')}
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Card - Left side */}
          <div className="info-card flex flex-col">
            <div className="space-y-4 flex-grow">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  {t('ceremony.church')}
                </h3>
                <p className="text-text-secondary">{WEDDING_CONFIG.churchName}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  {t('ceremony.date')}
                </h3>
                <p className="text-text-secondary">{getFormattedDate(WEDDING_CONFIG.weddingDateISO, language)}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  {t('ceremony.time')}
                </h3>
                <p className="text-text-secondary">{getFormattedTime(WEDDING_CONFIG.ceremonyTimeISO, language)}</p>
              </div>

              <div className="pt-2">
                <p className="text-text-secondary text-sm mb-4">
                  {WEDDING_CONFIG.churchAddress}
                </p>
                <AddToCalendar type="ceremony" />
              </div>
            </div>

            {/* Map at bottom of card */}
            <div className="mt-6">
              <MapEmbed
                embedUrl={WEDDING_CONFIG.churchMapsUrl}
                title={WEDDING_CONFIG.churchName}
              />
            </div>
          </div>

          {/* Image - Right side */}
          <div className="relative rounded-lg overflow-hidden shadow-lg min-h-[400px] md:min-h-0">
            <img
              src={ChurchImage}
              alt={WEDDING_CONFIG.churchName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
