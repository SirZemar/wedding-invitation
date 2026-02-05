export default function MapEmbed({ embedUrl, title }) {
  if (!embedUrl || embedUrl.startsWith('[')) {
    // Placeholder when URL not configured
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-text-secondary">
        Map will appear here
      </div>
    )
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </div>
  )
}
