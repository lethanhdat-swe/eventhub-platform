import { Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HeaderSearch() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-(--primary-color)/40 bg-(--surface-color)">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm..."
        className="w-52 text-sm bg-transparent outline-none text-(--text-primary) placeholder:text-gray-500"
      />
      {value && (
        <button type="button" onClick={() => setValue('')}>
          <X size={14} className="opacity-50 hover:opacity-100" color="var(--text-primary)" />
        </button>
      )}
      <button type="submit" className="p-0.5 rounded-full hover:bg-(--primary-color)/10 transition-colors">
        <Search size={20} color="var(--primary-color)" />
      </button>
    </form>
  );
}