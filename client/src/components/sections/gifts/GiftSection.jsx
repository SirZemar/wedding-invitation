import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { WEDDING_CONFIG } from '@/utils/calendar'

export default function GiftSection() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copyIBAN = async () => {
    try {
      const cleanIBAN = WEDDING_CONFIG.iban.replace(/\s+/g, '')
      await navigator.clipboard.writeText(cleanIBAN)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section className="section bg-background" id="gifts">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="section-title font-serif">{t('gifts.title')}</h2>

        <p className="text-text-secondary mb-8 leading-relaxed">
          {t('gifts.message')}
        </p>

        <BankDetails
          copied={copied} 
          onCopy={copyIBAN}
        />
      </div>
    </section>
  )
}

function BankDetails({copied, onCopy}) {
  const { t } = useLanguage()

  return (
    <div className="info-card text-left">
      <h3 className="font-medium text-text-primary mb-4">
        {t('gifts.bankDetails')}
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-text-secondary">{t('gifts.accountHolder')}</span>
          <span className="font-medium">{WEDDING_CONFIG.accountHolder}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-text-secondary">{t('gifts.bank')}</span>
          <span className="font-medium">{WEDDING_CONFIG.bankName}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-text-secondary">{t('gifts.iban')}</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{WEDDING_CONFIG.iban}</span>
            <button
              onClick={onCopy}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-text-secondary'
              }`}
            >
              {copied ? t('gifts.copied') : t('gifts.copyIban')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}