import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getCountdown,
  getFormattedDate,
  createCeremonyCalendarEvent,
  createPartyCalendarEvent,
  WEDDING_CONFIG
} from '../utils/calendar'

describe('Calendar Utilities', () => {
  describe('WEDDING_CONFIG', () => {
    it('should have required fields', () => {
      expect(WEDDING_CONFIG.brideName).toBeDefined()
      expect(WEDDING_CONFIG.groomName).toBeDefined()
      expect(WEDDING_CONFIG.weddingDate).toBeDefined()
      expect(WEDDING_CONFIG.weddingDateISO).toBeDefined()
      expect(WEDDING_CONFIG.ceremonyTime).toBeDefined()
      expect(WEDDING_CONFIG.partyTime).toBeDefined()
    })
  })

  describe('getFormattedDate', () => {
    it('should format date in English', () => {
      const date = getFormattedDate(WEDDING_CONFIG.weddingDateISO, 'en')
      expect(date).toContain('2026')
      expect(date).toMatch(/september/i)
    })

    it('should format date in Portuguese', () => {
      const date = getFormattedDate(WEDDING_CONFIG.weddingDateISO, 'pt')
      expect(date).toContain('2026')
      expect(date).toMatch(/setembro/i)
    })

    it('should format date in Ukrainian', () => {
      const date = getFormattedDate(WEDDING_CONFIG.weddingDateISO, 'uk')
      expect(date).toContain('2026')
      // Ukrainian uses вересня for September
      expect(date).toMatch(/вересня/i)
    })

    it('should fallback to English for unknown language', () => {
      const date = getFormattedDate(WEDDING_CONFIG.weddingDateISO, 'xyz')
      expect(date).toContain('2026')
    })
  })

  describe('getCountdown', () => {
    it('should return countdown object with required fields', () => {
      const countdown = getCountdown()
      expect(countdown).toHaveProperty('days')
      expect(countdown).toHaveProperty('hours')
      expect(countdown).toHaveProperty('minutes')
      expect(countdown).toHaveProperty('seconds')
      expect(countdown).toHaveProperty('isPast')
    })

    it('should return non-negative values', () => {
      const countdown = getCountdown()
      expect(countdown.days).toBeGreaterThanOrEqual(0)
      expect(countdown.hours).toBeGreaterThanOrEqual(0)
      expect(countdown.minutes).toBeGreaterThanOrEqual(0)
      expect(countdown.seconds).toBeGreaterThanOrEqual(0)
    })
  })

  describe('createCeremonyCalendarEvent', () => {
    it('should generate valid ICS content', () => {
      const ics = createCeremonyCalendarEvent()

      expect(ics).toContain('BEGIN:VCALENDAR')
      expect(ics).toContain('END:VCALENDAR')
      expect(ics).toContain('BEGIN:VEVENT')
      expect(ics).toContain('END:VEVENT')
      expect(ics).toContain('SUMMARY:')
      expect(ics).toContain('DTSTART:')
      expect(ics).toContain('DTEND:')
    })

    it('should include couple names in summary', () => {
      const ics = createCeremonyCalendarEvent()
      expect(ics).toContain(WEDDING_CONFIG.brideName)
      expect(ics).toContain(WEDDING_CONFIG.groomName)
    })

    it('should include church location', () => {
      const ics = createCeremonyCalendarEvent()
      expect(ics).toContain('LOCATION:')
    })
  })

  describe('createPartyCalendarEvent', () => {
    it('should generate valid ICS content', () => {
      const ics = createPartyCalendarEvent()

      expect(ics).toContain('BEGIN:VCALENDAR')
      expect(ics).toContain('END:VCALENDAR')
      expect(ics).toContain('BEGIN:VEVENT')
      expect(ics).toContain('Celebration')
    })
  })
})
