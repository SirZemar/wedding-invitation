import { useState, useEffect } from 'react'
import { getAdminStats, getRSVPSubmissions } from '../utils/api'

export function useAdminData() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [error, setError] = useState(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [statsData, submissionsData] = await Promise.all([
        getAdminStats(),
        getRSVPSubmissions()
      ])
      setStats(statsData)
      setSubmissions(submissionsData)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    isLoading,
    stats,
    submissions,
    error,
    refreshData: loadData,
    setSubmissions
  }
}
