import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG } from '@/utils/calendar'
import MbwayLogo from '@/assets/MbwayLogo.jpg'

export default function GiftSection() {
  const { t } = useLanguage()
  const [copiedIban, setCopiedIban] = useState(false)
  const [copiedMbway, setCopiedMbway] = useState(false)

  const copyIBAN = async () => {
    try {
      const cleanIBAN = WEDDING_CONFIG.iban.replace(/\s+/g, '')
      await navigator.clipboard.writeText(cleanIBAN)
      setCopiedIban(true)
      setTimeout(() => setCopiedIban(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyMBWAY = async () => {
    try {
      const cleanPhone = WEDDING_CONFIG.mbwayPhone.replace(/\s+/g, '').replace('+351', '')
      await navigator.clipboard.writeText(cleanPhone)
      setCopiedMbway(true)
      setTimeout(() => setCopiedMbway(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section className="section bg-gradient-to-b from-background to-gray-50" id="gifts">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title font-serif text-center">{t('gifts.title')}</h2>

        <p className="text-center text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
          {t('gifts.message')}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <BankDetails
            copied={copiedIban}
            onCopy={copyIBAN}
          />

          <MBWAYDetails
            copied={copiedMbway}
            onCopy={copyMBWAY}
          />
        </div>
      </div>
    </section>
  )
}

function BankDetails({copied, onCopy}) {
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg text-text-primary">
          {t('gifts.bankDetails')}
        </h3>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-text-secondary font-medium">{t('gifts.accountHolder')}</span>
          <span className="text-text-primary font-medium">{WEDDING_CONFIG.accountHolder}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-text-secondary font-medium">{t('gifts.bank')}</span>
          <span className="text-text-primary font-medium">{WEDDING_CONFIG.bankName}</span>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs uppercase tracking-wider text-text-secondary font-medium">{t('gifts.iban')}</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <span className="font-mono text-sm text-text-primary break-all">{WEDDING_CONFIG.iban}</span>
            </div>
            <button
              onClick={onCopy}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                copied
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('gifts.copied')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t('gifts.copyIban')}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MBWAYDetails({copied, onCopy}) {
  const { t } = useLanguage()

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group">
      {/* Header with logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
          <img
            src={MbwayLogo}
            alt="MBWAY"
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="font-semibold text-lg text-text-primary">
          {t('gifts.mbway')}
        </h3>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs uppercase tracking-wider text-text-secondary font-medium">{t('gifts.phoneNumber')}</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <span className="font-mono text-sm text-text-primary">{WEDDING_CONFIG.mbwayPhone}</span>
            </div>
            <button
              onClick={onCopy}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                copied
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('gifts.copied')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t('gifts.copyPhone')}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}