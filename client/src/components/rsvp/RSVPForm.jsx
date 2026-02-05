import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { submitRSVP } from '../../utils/api'

const createEmptyGuest = () => ({
  id: Date.now(),
  name: '',
  attending: true,
  isPlusOneRequest: false
})

export default function RSVPForm({ onSuccess, onError }) {
  const { t, language } = useLanguage()
  const [guests, setGuests] = useState([createEmptyGuest()])
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addGuest = () => {
    setGuests([...guests, createEmptyGuest()])
  }

  const removeGuest = (id) => {
    if (guests.length > 1) {
      setGuests(guests.filter(g => g.id !== id))
    }
  }

  const updateGuest = (id, field, value) => {
    setGuests(guests.map(g =>
      g.id === id ? { ...g, [field]: value } : g
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const validGuests = guests.filter(g => g.name.trim() !== '')
    if (validGuests.length === 0) {
      onError('At least one guest name is required')
      return
    }

    setIsSubmitting(true)

    try {
      await submitRSVP({
        guests: validGuests.map(g => ({
          name: g.name,
          attending: g.attending,
          isPlusOneRequest: g.isPlusOneRequest
        })),
        notes,
        language
      })
      onSuccess()
    } catch (error) {
      onError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guests */}
      <div className="space-y-4">
        {guests.map((guest, index) => (
          <div key={guest.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <label className="form-label">
                {t('rsvp.guestName')} {guests.length > 1 && `#${index + 1}`}
              </label>
              {guests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGuest(guest.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  {t('rsvp.removeGuest')}
                </button>
              )}
            </div>

            <input
              type="text"
              value={guest.name}
              onChange={(e) => updateGuest(guest.id, 'name', e.target.value)}
              placeholder={t('rsvp.guestNamePlaceholder')}
              className="form-input"
              required
            />

            <div className="space-y-2">
              <label className="form-label">{t('rsvp.attending')}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`attending-${guest.id}`}
                    checked={guest.attending}
                    onChange={() => updateGuest(guest.id, 'attending', true)}
                    className="w-4 h-4 text-accent focus:ring-accent"
                  />
                  <span className="text-sm">{t('rsvp.yes')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`attending-${guest.id}`}
                    checked={!guest.attending}
                    onChange={() => updateGuest(guest.id, 'attending', false)}
                    className="w-4 h-4 text-accent focus:ring-accent"
                  />
                  <span className="text-sm">{t('rsvp.no')}</span>
                </label>
              </div>
            </div>

            {guest.attending && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={guest.isPlusOneRequest}
                  onChange={(e) => updateGuest(guest.id, 'isPlusOneRequest', e.target.checked)}
                  className="w-4 h-4 rounded text-accent focus:ring-accent"
                />
                <span className="text-sm text-text-secondary">{t('rsvp.plusOne')}</span>
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Add guest button */}
      <button
        type="button"
        onClick={addGuest}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-text-secondary hover:border-accent hover:text-accent transition-colors"
      >
        + {t('rsvp.addGuest')}
      </button>

      {/* Notes */}
      <div>
        <label className="form-label">{t('rsvp.notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('rsvp.notesPlaceholder')}
          rows={3}
          className="form-input resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn btn-primary py-3 text-lg"
      >
        {isSubmitting ? t('rsvp.submitting') : t('rsvp.submit')}
      </button>
    </form>
  )
}
