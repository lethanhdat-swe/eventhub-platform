import { Search } from 'lucide-react';

function SearchInput({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Search</label>
      <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-700 focus-within:border-(--primary-color) transition-colors">
        <Search color="gray" />
        <input
          type="text"
          placeholder="Search events..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm text-gray-300 placeholder-gray-500 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

export default SearchInput;
