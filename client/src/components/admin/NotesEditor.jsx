import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

export default function NotesEditor({ submissionId, notes, onSave }) {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(notes || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(submissionId, value)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setValue(notes || '')
    setIsEditing(false)
  }

  return (
    <div className="border-t border-gray-100 pt-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm text-text-secondary">{t('admin.notes')}:</span>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-accent hover:text-accent-hover"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="form-input text-sm"
            rows={3}
            placeholder="Add notes..."
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary text-xs px-3 py-1"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="btn btn-secondary text-xs px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm mt-1">
          {notes || <span className="text-text-secondary italic">No notes</span>}
        </p>
      )}
    </div>
  )
}
