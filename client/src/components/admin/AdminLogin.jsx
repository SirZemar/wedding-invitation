import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { adminLogin } from '../../utils/api'

export default function AdminLogin({ onLoginSuccess }) {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await adminLogin(password)
      setPassword('')
      onLoginSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="admin-card max-w-md w-full">
        <h1 className="font-serif text-2xl text-center mb-6">{t('admin.title')}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">{t('admin.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('admin.passwordPlaceholder')}
              className="form-input"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary"
          >
            {isLoading ? '...' : t('admin.login')}
          </button>
        </form>
      </div>
    </div>
  )
}
