import {MapPin } from 'lucide-react';

const LOCATIONS = ['All Locations', 'Ho Chi Minh City', 'Hanoi', 'Da Nang'];

function LocationSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-(--text-primary)">Location</label>
      <div className="group flex w-full items-center gap-4 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]">
        <MapPin className="text-(--text-primary) transition-colors duration-300 group-focus-within:text-(--primary-color)" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm"
           style={{ background: 'var(--surface-color)', color: 'var(--text-primary)' }}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc} >
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default LocationSelect;
