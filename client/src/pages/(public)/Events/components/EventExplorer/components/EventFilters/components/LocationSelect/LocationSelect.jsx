import { ChevronDown, MapPin } from 'lucide-react';

const LOCATIONS = ['All Locations', 'Ho Chi Minh City', 'Hanoi', 'Da Nang'];

function LocationSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Location</label>
      <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-700 hover:border-(--primary-color) transition-colors cursor-pointer">
        <MapPin color="gray" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm text-gray-300 bg-transparent outline-none appearance-none cursor-pointer"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc} className="bg-gray-800">
              {loc}
            </option>
          ))}
        </select>
        <ChevronDown color="gray" />
      </div>
    </div>
  );
}
export default LocationSelect;
