import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useAdminData } from '../hooks/useAdminData'
import { useSubmissionActions } from '../hooks/useSubmissionActions'
import { adminLogout, isAdminAuthenticated } from '../utils/api'
import AdminLogin from '../components/admin/AdminLogin'
import AdminStats from '../components/admin/AdminStats'
import SubmissionsList from '../components/admin/SubmissionsList'

export default function Admin() {
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated())

  const {
    isLoading,
    stats,
    submissions,
    error,
    refreshData,
    setSubmissions
  } = useAdminData()

  const {
    handleDelete,
    handleUpdateNotes,
    handlePlusOneStatus,
    handleUpdateGuest,
    handleAddGuest,
    handleDeleteGuest
  } = useSubmissionActions(submissions, setSubmissions, refreshData)

  const handleLogout = () => {
    adminLogout()
    setIsAuthenticated(false)
  }

  const handleDeleteWithConfirm = (id) => {
    handleDelete(id, t('admin.confirmDelete'))
  }

  // Login form
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-2xl md:text-3xl">{t('admin.title')}</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            {t('admin.logout')}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && !stats ? (
          <div className="text-center py-12 text-text-secondary">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <>
            {/* Stats */}
            <AdminStats stats={stats} />

            {/* Submissions */}
            <SubmissionsList
              submissions={submissions}
              onDelete={handleDeleteWithConfirm}
              onUpdateNotes={handleUpdateNotes}
              onPlusOneStatusChange={handlePlusOneStatus}
              onUpdateGuest={handleUpdateGuest}
              onAddGuest={handleAddGuest}
              onDeleteGuest={handleDeleteGuest}
            />
          </>
        )}
      </div>
    </div>
  )
}
