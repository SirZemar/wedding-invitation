import { useState } from 'react'
import {
  deleteRSVPSubmission,
  updateSubmissionNotes,
  updatePlusOneStatus
} from '../utils/api'

export function useSubmissionActions(submissions, setSubmissions, refreshData) {
  const [actionLoading, setActionLoading] = useState({})

  const handleDelete = async (id, confirmMessage) => {
    if (!window.confirm(confirmMessage)) return

    setActionLoading(prev => ({ ...prev, [`delete-${id}`]: true }))
    try {
      await deleteRSVPSubmission(id)
      setSubmissions(submissions.filter(s => s.id !== id))
      refreshData() // Refresh stats
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${id}`]: false }))
    }
  }

  const handleUpdateNotes = async (id, notes) => {
    setActionLoading(prev => ({ ...prev, [`notes-${id}`]: true }))
    try {
      await updateSubmissionNotes(id, notes)
      setSubmissions(submissions.map(s =>
        s.id === id ? { ...s, notes } : s
      ))
    } catch (error) {
      console.error('Failed to save notes:', error)
      throw error
    } finally {
      setActionLoading(prev => ({ ...prev, [`notes-${id}`]: false }))
    }
  }

  const handlePlusOneStatus = async (submissionId, guestId, status) => {
    setActionLoading(prev => ({ ...prev, [`plus-${guestId}`]: true }))
    try {
      await updatePlusOneStatus(submissionId, guestId, status)
      setSubmissions(submissions.map(s => {
        if (s.id === submissionId) {
          return {
            ...s,
            guests: s.guests.map(g =>
              g.id === guestId ? { ...g, plusOneStatus: status } : g
            )
          }
        }
        return s
      }))
      refreshData() // Refresh stats to update plus one count
    } catch (error) {
      console.error('Failed to update plus one status:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [`plus-${guestId}`]: false }))
    }
  }

  return {
    handleDelete,
    handleUpdateNotes,
    handlePlusOneStatus,
    actionLoading
  }
}
