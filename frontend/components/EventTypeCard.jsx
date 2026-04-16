'use client';
// components/EventTypeCard.jsx
// Shows one event type with edit / delete / copy-link actions.

export default function EventTypeCard({ event, onEdit, onDelete }) {
  const copyLink = () => {
    const url = `${window.location.origin}/book/${event.slug}`;
    navigator.clipboard.writeText(url).then(() => alert('Booking link copied!'));
  };

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      {/* Coloured top stripe */}
      <div className="h-1.5" style={{ backgroundColor: event.color }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{event.title}</h3>
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
              </svg>
              {event.duration_minutes} min
            </span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            event.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {event.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Booking link pill */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-xs text-gray-400 truncate flex-1">/book/{event.slug}</span>
          <button
            onClick={copyLink}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex-shrink-0"
          >
            Copy
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
          <button
            onClick={onEdit}
            className="flex-1 text-sm text-gray-600 hover:text-gray-900 font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={onDelete}
            className="flex-1 text-sm text-red-500 hover:text-red-600 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
