import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import GuestList from './GuestList'
import NotesEditor from './NotesEditor'

export default function SubmissionCard({
  submission,
  onDelete,
  onUpdateNotes,
  onPlusOneStatusChange
}) {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString()
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">
            {formatDate(submission.created_at)}
          </span>
          <span className="uppercase text-xs bg-gray-100 px-2 py-1 rounded">
            {submission.language}
          </span>
        </div>
        <button
          onClick={() => onDelete(submission.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          {t('admin.delete')}
        </button>
      </div>

      {/* Guests Summary/List */}
      <div className="mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-medium hover:text-accent flex items-center gap-2 w-full text-left"
        >
          <span>
            {submission.guests.length} {t('admin.guests').toLowerCase()}
            {submission.guests.length !== 1 ? '' : ''}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <GuestList
            guests={submission.guests}
            submissionId={submission.id}
            onPlusOneStatusChange={onPlusOneStatusChange}
          />
        )}
      </div>

      {/* Notes */}
      <NotesEditor
        submissionId={submission.id}
        notes={submission.notes}
        onSave={onUpdateNotes}
      />
    </div>
  )
}
