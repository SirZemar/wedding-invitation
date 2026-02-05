import { useLanguage } from '../../../hooks/useLanguage'

export default function TransportationSection() {
  const { t } = useLanguage()

  return (
    <section className="section bg-background" id="transportation">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title font-serif">{t('transportation.title')}</h2>

        <div className="space-y-6">

          {/* Uber/Bolt */}
          <div className="info-card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <svg className="w-6 h-6 text-accent mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-text-primary">{t('transportation.byTaxi')}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{t('transportation.byTaxiDescription')}</p>
              </div>
            </div>
          </div>
          
          {/* By Public Transport */}
          <div className="info-card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {t('transportation.byPublicTransport')}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {t('transportation.byPublicTransportDescription')}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed mt-3">
                  <strong>{t('transportation.byPublicTransportDescriptionImportant')}</strong> {t('transportation.byPublicTransportDescriptionNote')}
                </p>
              </div>
            </div>
          </div>

          {/* Parking */}
          <div className="info-card bg-accent/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {t('transportation.parking')}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {t('transportation.parkingDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
