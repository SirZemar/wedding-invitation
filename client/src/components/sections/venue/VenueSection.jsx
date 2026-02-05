import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG, getFormattedTime } from '@/utils/calendar'
import MapEmbed from '@/components/common/MapEmbed'
import AddToCalendar from '@/components/common/AddToCalendar'
import VenueImage from '@/assets/VenueImage.jpg'

export default function VenueSection() {
  const { t, language } = useLanguage()

  return (
    <section className="section bg-gray-50" id="venue">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title font-serif">{t('venue.title')}</h2>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Image - Left side */}
          <div className="relative rounded-lg overflow-hidden shadow-lg min-h-[400px] md:min-h-0 order-2 md:order-1">
            <img
              src={VenueImage}
              alt={WEDDING_CONFIG.venueName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Card - Right side */}
          <div className="info-card flex flex-col order-1 md:order-2">
            <div className="space-y-4 flex-grow">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  {t('venue.location')}
                </h3>
                <p className="text-text-secondary">{WEDDING_CONFIG.venueName}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  {t('venue.time')}
                </h3>
                <p className="text-text-secondary">{getFormattedTime(WEDDING_CONFIG.partyTimeISO, language)}</p>
              </div>

              <div className="pt-2">
                <p className="text-text-secondary text-sm mb-4">
                  {WEDDING_CONFIG.venueAddress}
                </p>
                <AddToCalendar type="party" />
              </div>
            </div>

            {/* Map at bottom of card */}
            <div className="mt-6">
              <MapEmbed
                embedUrl={WEDDING_CONFIG.venueMapsUrl}
                title={WEDDING_CONFIG.venueName}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
