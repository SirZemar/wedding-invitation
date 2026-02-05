export default function GuestList({ guests, submissionId, onPlusOneStatusChange }) {
  return (
    <ul className="mt-3 space-y-2">
      {guests.map((guest) => (
        <GuestItem
          key={guest.id}
          guest={guest}
          submissionId={submissionId}
          onPlusOneStatusChange={onPlusOneStatusChange}
        />
      ))}
    </ul>
  )
}

function GuestItem({ guest, submissionId, onPlusOneStatusChange }) {
  const getPlusOneStatusBadge = () => {
    if (!guest.isPlusOneRequest) return null

    const status = guest.plusOneStatus

    const badges = {
      approved: (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
          +1 Approved
        </span>
      ),
      rejected: (
        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
          +1 Rejected
        </span>
      ),
      null: (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
          +1 Pending
        </span>
      )
    }

    return badges[status] || badges.null
  }

  return (
    <li className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded">
      <span className={guest.attending ? 'text-green-600' : 'text-red-600'}>
        {guest.attending ? '✓' : '✗'}
      </span>
      <span className="font-medium">{guest.name}</span>

      {guest.isPlusOneRequest && (
        <div className="flex items-center gap-2 ml-auto">
          {getPlusOneStatusBadge()}

          <div className="flex gap-1">
            {guest.plusOneStatus !== 'approved' && (
              <button
                onClick={() => onPlusOneStatusChange(submissionId, guest.id, 'approved')}
                className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                title="Approve +1"
              >
                ✓
              </button>
            )}
            {guest.plusOneStatus !== 'rejected' && (
              <button
                onClick={() => onPlusOneStatusChange(submissionId, guest.id, 'rejected')}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                title="Reject +1"
              >
                ✗
              </button>
            )}
            {guest.plusOneStatus && (
              <button
                onClick={() => onPlusOneStatusChange(submissionId, guest.id, null)}
                className="text-xs px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                title="Reset to pending"
              >
                ↺
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
