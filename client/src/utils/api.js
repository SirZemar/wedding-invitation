// Use environment variable for API base URL in production
const API_BASE = import.meta.env.VITE_API_URL || '/api'

// Helper to get auth token
function getAuthToken() {
  return localStorage.getItem('admin-token')
}

// Helper for authenticated requests
function authHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Submit RSVP
export async function submitRSVP(data) {
  const response = await fetch(`${API_BASE}/rsvp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to submit RSVP')
  }

  return response.json()
}

// Admin login
export async function adminLogin(password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Login failed')
  }

  const data = await response.json()
  localStorage.setItem('admin-token', data.token)
  return data
}

// Admin logout
export function adminLogout() {
  localStorage.removeItem('admin-token')
}

// Check if admin is authenticated
export function isAdminAuthenticated() {
  return !!getAuthToken()
}

// Get admin stats
export async function getAdminStats() {
  const response = await fetch(`${API_BASE}/admin/stats`, {
    headers: authHeaders()
  })

  if (!response.ok) {
    if (response.status === 401) {
      adminLogout()
      throw new Error('Session expired')
    }
    throw new Error('Failed to fetch stats')
  }

  return response.json()
}

// Get all RSVP submissions
export async function getRSVPSubmissions() {
  const response = await fetch(`${API_BASE}/rsvp`, {
    headers: authHeaders()
  })

  if (!response.ok) {
    if (response.status === 401) {
      adminLogout()
      throw new Error('Session expired')
    }
    throw new Error('Failed to fetch submissions')
  }

  return response.json()
}

// Delete RSVP submission
export async function deleteRSVPSubmission(id) {
  const response = await fetch(`${API_BASE}/rsvp/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })

  if (!response.ok) {
    if (response.status === 401) {
      adminLogout()
      throw new Error('Session expired')
    }
    throw new Error('Failed to delete submission')
  }

  return response.json()
}

// Update submission notes
export async function updateSubmissionNotes(id, notes) {
  const response = await fetch(`${API_BASE}/rsvp/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify({ notes })
  })

  if (!response.ok) {
    if (response.status === 401) {
      adminLogout()
      throw new Error('Session expired')
    }
    throw new Error('Failed to update notes')
  }

  return response.json()
}

// Update guest plus one status
export async function updatePlusOneStatus(submissionId, guestId, plusOneStatus) {
  const response = await fetch(`${API_BASE}/rsvp/${submissionId}/guest/${guestId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ plusOneStatus })
  })
  if (!response.ok) {
    if (response.status === 401) { adminLogout(); throw new Error('Session expired') }
    throw new Error('Failed to update plus one status')
  }
  return response.json()
}

// Update guest name / attending
export async function updateGuest(submissionId, guestId, fields) {
  const response = await fetch(`${API_BASE}/rsvp/${submissionId}/guest/${guestId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(fields)
  })
  if (!response.ok) {
    if (response.status === 401) { adminLogout(); throw new Error('Session expired') }
    throw new Error('Failed to update guest')
  }
  return response.json()
}

// Add a guest to a submission
export async function addGuest(submissionId, guest) {
  const response = await fetch(`${API_BASE}/rsvp/${submissionId}/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(guest)
  })
  if (!response.ok) {
    if (response.status === 401) { adminLogout(); throw new Error('Session expired') }
    throw new Error('Failed to add guest')
  }
  return response.json()
}

// Delete a guest
export async function deleteGuest(submissionId, guestId) {
  const response = await fetch(`${API_BASE}/rsvp/${submissionId}/guest/${guestId}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  if (!response.ok) {
    if (response.status === 401) { adminLogout(); throw new Error('Session expired') }
    throw new Error('Failed to delete guest')
  }
  return response.json()
}

// Get CSV export URL
export function getExportCSVUrl() {
  const token = getAuthToken()
  return `${API_BASE}/admin/export?token=${token}`
}

// Export CSV with fetch (for download)
export async function exportCSV() {
  const response = await fetch(`${API_BASE}/admin/export`, {
    headers: authHeaders()
  })

  if (!response.ok) {
    if (response.status === 401) {
      adminLogout()
      throw new Error('Session expired')
    }
    throw new Error('Failed to export CSV')
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'rsvp-export.csv'
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
