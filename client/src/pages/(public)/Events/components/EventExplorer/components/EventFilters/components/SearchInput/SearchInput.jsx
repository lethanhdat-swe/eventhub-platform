import { Search } from 'lucide-react';

function SearchInput({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-(--text-primary)">Tìm kiếm</label>
      <div className="group flex w-full items-center gap-4 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]">
        <Search className="text-gray-500 transition-colors duration-300 group-focus-within:text-(--primary-color)" />
        <input
          type="text"
          placeholder="Tìm sự kiện..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600"
        />
      </div>
    </div>
  );
}

export default SearchInput;
