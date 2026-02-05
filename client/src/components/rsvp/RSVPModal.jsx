import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG, getFormattedDate } from '@/utils/calendar'
import RSVPForm from './RSVPForm'

export default function RSVPModal({ isOpen, onClose }) {
  const { t, language } = useLanguage()
  const [status, setStatus] = useState('form') // 'form', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const handleSuccess = () => {
    setStatus('success')
  }

  const handleError = (message) => {
    setErrorMessage(message)
    setStatus('error')
  }

  const handleClose = () => {
    setStatus('form')
    setErrorMessage('')
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="font-serif text-2xl text-text-primary">
              {t('rsvp.title')}
            </h2>
            {status === 'form' && (
              <p className="text-sm text-text-secondary mt-1">
                {t('rsvp.subtitle')} {getFormattedDate(WEDDING_CONFIG.rsvpDeadlineISO, language)}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'form' && (
            <RSVPForm onSuccess={handleSuccess} onError={handleError} />
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('rsvp.success')}
              </h3>
              <p className="text-text-secondary mb-6">
                {t('rsvp.successMessage')}
              </p>
              <button onClick={handleClose} className="btn btn-primary">
                {t('rsvp.close')}
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('rsvp.error')}
              </h3>
              <p className="text-text-secondary mb-6">
                {errorMessage}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setStatus('form')} className="btn btn-primary">
                  Try Again
                </button>
                <button onClick={handleClose} className="btn btn-secondary">
                  {t('rsvp.close')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
