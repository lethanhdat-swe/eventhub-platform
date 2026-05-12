import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300
        ${open ? 'w-52 px-3 py-1.5 rounded-full border border-(--primary-color)/40 bg-(--surface-color)' : 'w-0'}`}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tìm kiếm..."
          className="w-full text-sm bg-transparent outline-none text-(--text-primary) placeholder:text-gray-500"
        />
        {value && (
          <button type="button" onClick={() => setValue('')}>
            <X size={14} className="opacity-50 hover:opacity-100"  color="var(--text-primary)"/>
          </button>
        )}
      </div>
      <button type={open ? 'submit' : 'button'} onClick={() => !open && setOpen(true)}
        className="p-1.5 rounded-full hover:bg-(--primary-color)/10 transition-colors"
      >
        {open ? <Search size={20} color="var(--primary-color)" /> : <Search size={20} color="var(--text-primary)" />}
      </button>
    </form>
  );
}