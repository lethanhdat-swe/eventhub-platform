import { events } from '@/pages/(public)/Events/data';

const event = ['Featured', 'Trending', 'New'];

function EventFilterBar({ value, onChange }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1 text-[15px]">
        <p className="text-(--primary-color)">{events.length}</p>
        <p className="text-gray-500">Events Found</p>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-(--text-primary)">Sort by:</label>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 border border-gray-700 hover:border-(--primary-color) transition-colors cursor-pointer bg-(--background-color)/70">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full text-sm outline-none"
              style={{ background: 'var(--surface-color)', color: 'var(--text-primary)' }}
            >
              {event.map((loc) => (
                <option key={loc} value={loc} className='bg-transparent'>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventFilterBar;
