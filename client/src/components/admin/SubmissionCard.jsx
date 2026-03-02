import { useLanguage } from '../../hooks/useLanguage'
import GuestList from './GuestList'
import NotesEditor from './NotesEditor'

export default function SubmissionCard({
  submission,
  onDelete,
  onUpdateNotes,
  onPlusOneStatusChange,
  onUpdateGuest,
  onAddGuest,
  onDeleteGuest
}) {
  const { t } = useLanguage()

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

      {/* Guests List */}
      <div className="mb-3">
        <span className="font-medium">
          {submission.guests.length} {t('admin.guests').toLowerCase()}
        </span>
        <GuestList
          guests={submission.guests}
          submissionId={submission.id}
          onPlusOneStatusChange={onPlusOneStatusChange}
          onUpdateGuest={onUpdateGuest}
          onAddGuest={onAddGuest}
          onDeleteGuest={onDeleteGuest}
        />
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
