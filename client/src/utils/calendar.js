// Wedding configuration - replace these placeholders
export const WEDDING_CONFIG = {
  // Couple details
  brideName: 'Alla',
  groomName: 'Eduardo',

  // Wedding date and times
  weddingDate: 'September 18, 2026', // e.g., "July 15, 2025"
  weddingDateISO: '2026-09-18', // e.g., "2025-07-15"
  ceremonyTime: '13:00', // e.g., "14:00"
  ceremonyTimeISO: '2026-09-18T13:00:00', // e.g., "14:00"
  partyTime: '15:00', // e.g., "16:00"
  partyTimeISO: '2026-09-18T15:00:00', // e.g., "16:00"

  // Church details
  churchName: 'Igreja Paroquial de Nossa Senhora da Conceição',
  churchAddress: 'Praça do Marquês de Pombal 111, 4000-307 Porto, Portugal',
  churchMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.770015142389!2d-8.610453910120794!3d41.161369497404706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2464579833f8cf%3A0xbd81c5c1b042e8c0!2sIgreja%20Paroquial%20de%20Nossa%20Senhora%20da%20Concei%C3%A7%C3%A3o!5e0!3m2!1sen!2spt!4v1769983055913!5m2!1sen!2spt',

  // Venue details
  venueName: 'Quinta da Morgadinha Rio Tinto',
  venueAddress: 'R. Pedro Álvares Cabral 345, 4435-448 Rio Tinto, Portugal',
  venueMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.264652674138!2d-8.556995600000002!3d41.172394499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd24639a3ed3773d%3A0xb19fa18ef17ed8a6!2sQuinta%20da%20Morgadinha!5e0!3m2!1sen!2spt!4v1769983005695!5m2!1sen!2spt',

  // Bank details for gifts
  accountHolder: 'Eduardo Marinho',
  iban: 'PT50 0023 0000 4575 8992 7229 4',
  bankName: 'ActivoBank',

  // MBWAY
  mbwayPhone: '+351 916 243 800',

  // RSVP deadline
  rsvpDeadlineISO: '2026-08-15'
}

// Format date for ICS file (YYYYMMDDTHHMMSS)
function formatICSDate(dateStr, time) {
  const date = new Date(`${dateStr}T${time}:00`)
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

// Generate UID for calendar event
function generateUID() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@wedding`
}

// Create ICS file content for ceremony
export function createCeremonyCalendarEvent() {
  const { weddingDateISO, ceremonyTime, churchName, churchAddress, brideName, groomName } = WEDDING_CONFIG

  const startDate = formatICSDate(weddingDateISO, ceremonyTime)
  // Ceremony usually lasts about 1 hour
  const endTime = `${parseInt(ceremonyTime.split(':')[0]) + 1}:${ceremonyTime.split(':')[1]}`
  const endDate = formatICSDate(weddingDateISO, endTime)

  const icsContent = `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Wedding Invitation//EN
    CALSCALE:GREGORIAN
    METHOD:PUBLISH
    BEGIN:VEVENT
    UID:${generateUID()}
    DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
    DTSTART:${startDate}
    DTEND:${endDate}
    SUMMARY:Wedding Ceremony - ${brideName} & ${groomName}
    DESCRIPTION:Wedding ceremony of ${brideName} and ${groomName}
    LOCATION:${churchName}, ${churchAddress}
    STATUS:CONFIRMED
    END:VEVENT
    END:VCALENDAR`

  return icsContent
}

// Create ICS file content for party/celebration
export function createPartyCalendarEvent() {
  const { weddingDateISO, partyTime, venueName, venueAddress, brideName, groomName } = WEDDING_CONFIG

  const startDate = formatICSDate(weddingDateISO, partyTime)
  // Party ends late, let's say 6 hours after start
  const endHour = parseInt(partyTime.split(':')[0]) + 6
  const endTime = `${endHour > 23 ? endHour - 24 : endHour}:${partyTime.split(':')[1]}`
  const endDate = formatICSDate(weddingDateISO, endTime)

  const icsContent = `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Wedding Invitation//EN
    CALSCALE:GREGORIAN
    METHOD:PUBLISH
    BEGIN:VEVENT
    UID:${generateUID()}
    DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
    DTSTART:${startDate}
    DTEND:${endDate}
    SUMMARY:Wedding Celebration - ${brideName} & ${groomName}
    DESCRIPTION:Wedding celebration of ${brideName} and ${groomName}
    LOCATION:${venueName}, ${venueAddress}
    STATUS:CONFIRMED
    END:VEVENT
    END:VCALENDAR`

  return icsContent
}

// Generate Google Calendar URL
export function getGoogleCalendarUrl(type = 'ceremony') {
  const { weddingDateISO, ceremonyTime, partyTime, churchName, churchAddress, venueName, venueAddress, brideName, groomName } = WEDDING_CONFIG

  const isCeremony = type === 'ceremony'
  const startTime = isCeremony ? ceremonyTime : partyTime
  const endHour = parseInt(startTime.split(':')[0]) + (isCeremony ? 1 : 6)
  const endTime = `${String(endHour).padStart(2, '0')}:${startTime.split(':')[1]}`

  // Format: YYYYMMDDTHHMMSS (no timezone = floating time)
  const formatGoogleDate = (date, time) => {
    return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`
  }

  const startDate = formatGoogleDate(weddingDateISO, startTime)
  const endDate = formatGoogleDate(weddingDateISO, endTime)

  const title = isCeremony
    ? `Wedding Ceremony - ${brideName} & ${groomName}`
    : `Wedding Celebration - ${brideName} & ${groomName}`

  const description = isCeremony
    ? `Wedding ceremony of ${brideName} and ${groomName}`
    : `Wedding celebration of ${brideName} and ${groomName}`

  const location = isCeremony
    ? `${churchName}, ${churchAddress}`
    : `${venueName}, ${venueAddress}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    details: description,
    location: location
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Download ICS file
export function downloadCalendarEvent(type = 'ceremony') {
  const content = type === 'ceremony' ? createCeremonyCalendarEvent() : createPartyCalendarEvent()
  const filename = type === 'ceremony' ? 'wedding-ceremony.ics' : 'wedding-celebration.ics'

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Format date based on language
export function getFormattedDate(dateISO, language) {
  const date = new Date(dateISO)
  const locales = { pt: 'pt-PT', en: 'en-US', uk: 'uk-UA' }

  return date.toLocaleDateString(locales[language] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format time based on language
export function getFormattedTime(dateISO, language) {
  const date = new Date(dateISO)
  const locales = { pt: 'pt-PT', en: 'en-US', uk: 'uk-UA' }

  return date.toLocaleTimeString(locales[language] || 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: language === 'en' // Usually English uses AM/PM, others use 24h
  })
}

// Calculate countdown to wedding
export function getCountdown() {
  const weddingDate = new Date(WEDDING_CONFIG.ceremonyTimeISO)
  const now = new Date()
  const diff = weddingDate - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isPast: false }
}
