import { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { getCountdown } from '../../utils/calendar'

export default function Countdown() {
  const { t } = useLanguage()
  const [countdown, setCountdown] = useState(getCountdown())

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (countdown.isPast) {
    return null
  }

  return (
    <div className="flex justify-center gap-6 md:gap-12">
      <div className="countdown-item">
        <div className="countdown-value">{countdown.days}</div>
        <div className="countdown-label">{t('countdown.days')}</div>
      </div>
      <div className="countdown-item">
        <div className="countdown-value">{countdown.hours}</div>
        <div className="countdown-label">{t('countdown.hours')}</div>
      </div>
      <div className="countdown-item">
        <div className="countdown-value">{countdown.minutes}</div>
        <div className="countdown-label">{t('countdown.minutes')}</div>
      </div>
      <div className="countdown-item">
        <div className="countdown-value">{countdown.seconds}</div>
        <div className="countdown-label">{t('countdown.seconds')}</div>
      </div>
    </div>
  )
}
