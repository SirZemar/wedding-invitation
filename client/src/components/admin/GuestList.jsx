import { useState } from 'react'

export default function GuestList({ guests, submissionId, onPlusOneStatusChange, onUpdateGuest, onAddGuest, onDeleteGuest }) {
  const [newGuest, setNewGuest] = useState(null)

  const handleAddClick = () => {
    setNewGuest({ name: '', attending: true })
  }

  const handleNewGuestSave = async () => {
    if (!newGuest.name.trim()) return
    await onAddGuest(submissionId, { name: newGuest.name.trim(), attending: newGuest.attending, isPlusOneRequest: false })
    setNewGuest(null)
  }

  return (
    <ul className="mt-3 space-y-2">
      {guests.map((guest) => (
        <GuestItem
          key={guest.id}
          guest={guest}
          submissionId={submissionId}
          onPlusOneStatusChange={onPlusOneStatusChange}
          onUpdateGuest={onUpdateGuest}
          onDeleteGuest={onDeleteGuest}
        />
      ))}

      {newGuest ? (
        <li className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
          <button
            onClick={() => setNewGuest(g => ({ ...g, attending: !g.attending }))}
            className={`text-sm font-bold w-5 ${newGuest.attending ? 'text-green-600' : 'text-red-600'}`}
          >
            {newGuest.attending ? '✓' : '✗'}
          </button>
          <input
            autoFocus
            value={newGuest.name}
            onChange={e => setNewGuest(g => ({ ...g, name: e.target.value }))}
            onKeyDown={e => { if (e.key === 'Enter') handleNewGuestSave(); if (e.key === 'Escape') setNewGuest(null) }}
            placeholder="Guest name"
            className="form-input text-sm flex-1 py-0.5"
          />
          <button onClick={handleNewGuestSave} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
          <button onClick={() => setNewGuest(null)} className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
        </li>
      ) : (
        <li>
          <button
            onClick={handleAddClick}
            className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 mt-1"
          >
            + Add guest
          </button>
        </li>
      )}
    </ul>
  )
}

function GuestItem({ guest, submissionId, onPlusOneStatusChange, onUpdateGuest, onDeleteGuest }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(guest.name)
  const [editAttending, setEditAttending] = useState(guest.attending)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!editName.trim()) return
    setIsSaving(true)
    try {
      await onUpdateGuest(submissionId, guest.id, { name: editName.trim(), attending: editAttending })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditName(guest.name)
    setEditAttending(guest.attending)
    setIsEditing(false)
  }

  const getPlusOneStatusBadge = () => {
    if (!guest.isPlusOneRequest) return null
    const badges = {
      approved: <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">+1 Approved</span>,
      rejected: <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">+1 Rejected</span>,
      null: <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">+1 Pending</span>
    }
    return badges[guest.plusOneStatus] || badges.null
  }

  if (isEditing) {
    return (
      <li className="flex items-center gap-2 p-2 bg-gray-100 rounded border border-gray-300">
        <button
          onClick={() => setEditAttending(a => !a)}
          className={`text-sm font-bold w-5 ${editAttending ? 'text-green-600' : 'text-red-600'}`}
        >
          {editAttending ? '✓' : '✗'}
        </button>
        <input
          autoFocus
          value={editName}
          onChange={e => setEditName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
          className="form-input text-sm flex-1 py-0.5"
        />
        <button onClick={handleSave} disabled={isSaving} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          {isSaving ? '...' : 'Save'}
        </button>
        <button onClick={handleCancel} disabled={isSaving} className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
      </li>
    )
  }

  return (
    <li className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded">
      <span className={guest.attending ? 'text-green-600' : 'text-red-600'}>
        {guest.attending ? '✓' : '✗'}
      </span>
      <span className="font-medium flex-1">{guest.name}</span>

      {guest.isPlusOneRequest && (
        <div className="flex items-center gap-2">
          {getPlusOneStatusBadge()}
          <div className="flex gap-1">
            {guest.plusOneStatus !== 'approved' && (
              <button onClick={() => onPlusOneStatusChange(submissionId, guest.id, 'approved')} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" title="Approve +1">✓</button>
            )}
            {guest.plusOneStatus !== 'rejected' && (
              <button onClick={() => onPlusOneStatusChange(submissionId, guest.id, 'rejected')} className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" title="Reject +1">✗</button>
            )}
            {guest.plusOneStatus && (
              <button onClick={() => onPlusOneStatusChange(submissionId, guest.id, null)} className="text-xs px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500" title="Reset to pending">↺</button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-1 ml-auto">
        <button onClick={() => setIsEditing(true)} className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700" title="Edit guest">✎</button>
        <button onClick={() => onDeleteGuest(submissionId, guest.id)} className="text-xs px-2 py-1 text-red-400 hover:text-red-600" title="Remove guest">✕</button>
      </div>
    </li>
  )
}
