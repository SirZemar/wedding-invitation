import { useLanguage } from '../../hooks/useLanguage'

export default function AdminStats({ stats }) {
  const { t } = useLanguage()

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <StatCard
        value={stats.totalSubmissions}
        label={t('admin.totalSubmissions')}
      />
      <StatCard
        value={stats.totalGuests}
        label={t('admin.totalGuests')}
      />
      <StatCard
        value={
          <>
            {stats.attendingGuests}
            {stats.approvedPlusOnes > 0 && (
              <span className="text-2xl"> + {stats.approvedPlusOnes}</span>
            )}
          </>
        }
        label={t('admin.attending')}
        color="text-green-600"
      />
      <StatCard
        value={stats.notAttendingGuests}
        label={t('admin.notAttending')}
        color="text-red-600"
      />
      <StatCard
        value={stats.plusOneRequests}
        label={t('admin.plusOneRequests')}
        color="text-blue-600"
      />
    </div>
  )
}

function StatCard({ value, label, color = '' }) {
  return (
    <div className="admin-card text-center">
      <div className={`admin-stat ${color}`}>{value}</div>
      <div className="text-text-secondary text-sm">{label}</div>
    </div>
  )
}
