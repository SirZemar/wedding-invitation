import { useLanguage } from '../../../hooks/useLanguage'
import AccommodationLogo from '../../../assets/AccommodationLogo.jpg'

export default function AccommodationSection() {
  const { t } = useLanguage()

  const hotels = [
    /* {
      name: t('accommodation.hotel1Name'),
      distance: t('accommodation.hotel1Distance'),
      description: t('accommodation.hotel1Description'),
      link: '[HOTEL_1_LINK]'
    }, */
  ]

  return (
    <section className="section bg-gray-50" id="accommodation">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title font-serif">{t('accommodation.title')}</h2>

        {/* Featured Apartments */}
        <div className="mb-8">
          <div className="info-card bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-2 shadow-sm">
                <img
                  src={AccommodationLogo}
                  alt="Oporto City View"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-text-primary mb-2">
                  {t('accommodation.apartmentsName')}
                </h3>
                <p className="text-text-secondary mb-4">
                  {t('accommodation.apartmentsDescription')}
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  {t('accommodation.apartmentsContact')}: <strong>+351 915 923 324</strong>
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://oportocityview.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex items-center gap-2"
                  >
                    {t('accommodation.viewWebsite')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/351915923324"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t('accommodation.apartmentsContactWA')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels */}
        {hotels.length > 0 && (
          <>
            <p className="text-center text-text-secondary mb-8 max-w-2xl mx-auto">
              {t('accommodation.subtitle')}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <HotelCard key={index} hotel={hotel} />
              ))}
            </div>
          </>
        )}

        {/* Additional Info */}
        <div className="mt-8 info-card bg-accent/5">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t('accommodation.additionalInfo')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HotelCard({ hotel }) {
  const { t } = useLanguage()

  return (
    <div className="info-card h-full flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          {hotel.name}
        </h3>
        <p className="text-sm text-accent mb-3 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hotel.distance}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">
          {hotel.description}
        </p>
      </div>
      {!hotel.link.startsWith('[') && (
        <a
          href={hotel.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 btn btn-secondary text-sm w-full text-center"
        >
          {t('accommodation.viewDetails')}
        </a>
      )}
    </div>
  )
}
