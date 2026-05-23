const SORT_OPTIONS = ['featured', 'new', 'upcoming'];

function EventFilterBar({ value, onChange, totalEvents }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1 text-[15px]">
        <p className="text-(--primary-color)">{totalEvents}</p>
        <p className="text-gray-500">Events Found</p>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-(--text-primary)">Sort by:</label>
        <div className="rounded-xl px-3 py-2.5 border border-gray-700 hover:border-(--primary-color) transition-colors bg-(--background-color)/70">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-sm outline-none"
            style={{ background: 'var(--surface-color)', color: 'var(--text-primary)' }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default EventFilterBar;