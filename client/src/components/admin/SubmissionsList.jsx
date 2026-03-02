import { useLanguage } from '../../hooks/useLanguage'
import SubmissionCard from './SubmissionCard'
import { exportCSV } from '../../utils/api'

export default function SubmissionsList({
  submissions,
  onDelete,
  onUpdateNotes,
  onPlusOneStatusChange,
  onUpdateGuest,
  onAddGuest,
  onDeleteGuest
}) {
  const { t } = useLanguage()

  const handleExport = async () => {
    try {
      await exportCSV()
    } catch (error) {
      console.error('Failed to export:', error)
    }
  }

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">{t('admin.allSubmissions')}</h2>
        <button
          onClick={handleExport}
          className="btn btn-secondary text-sm"
        >
          {t('admin.exportCsv')}
        </button>
      </div>

      {submissions.length === 0 ? (
        <p className="text-text-secondary text-center py-8">
          {t('admin.noSubmissions')}
        </p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onDelete={onDelete}
              onUpdateNotes={onUpdateNotes}
              onPlusOneStatusChange={onPlusOneStatusChange}
              onUpdateGuest={onUpdateGuest}
              onAddGuest={onAddGuest}
              onDeleteGuest={onDeleteGuest}
            />
          ))}
        </div>
      )}
    </div>
  )
}
