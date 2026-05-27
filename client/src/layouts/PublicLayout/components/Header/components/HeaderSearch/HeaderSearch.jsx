import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchDropdown } from './SearchDropdown';

export function HeaderSearch() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const openSearch = () => {
    setOpen(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const closeSearch = () => {
    setOpen(false);
    setValue('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const keyword = value.trim();

    if (!keyword) return;

    navigate(`/search?q=${encodeURIComponent(keyword)}`);

    closeSearch();
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        closeSearch();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.96,
        }}
        type="button"
        onClick={openSearch}
        className="
          group relative grid size-10 place-items-center
          overflow-hidden rounded-full
          cursor-pointer
          backdrop-blur-xl
          transition-all duration-300
          hover:border-[var(--primary-color)]/50
          hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]
        "
      >
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.18),transparent_70%)]
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          "
        />

        <Search
          size={18}
          className="
            relative z-10 text-[var(--primary-color)]
            transition-transform duration-300
            group-hover:scale-110
          "
        />
      </motion.button>

      <SearchDropdown
        open={open}
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        inputRef={inputRef}
      />
    </div>
  );
}
