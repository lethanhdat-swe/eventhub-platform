import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SORT_OPTIONS = [
  { label: 'Nổi bật', value: 'featured' },
  { label: 'Mới nhất', value: 'new' },
  { label: 'Sắp diễn ra', value: 'upcoming' },
];

function EventFilterBar({ value, onChange, totalEvents }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    SORT_OPTIONS.find((option) => option.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="mb-2 flex items-center justify-between gap-4">
      <p className="text-sm font-medium text-[var(--muted-text)]">
        Tìm thấy{' '}
        <span className="font-black text-[var(--primary-color)]">
          {totalEvents}
        </span>{' '}
        sự kiện phù hợp
      </p>

      <div className="flex items-center gap-2">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`
              cursor-pointer
              group inline-flex min-w-[132px] items-center justify-between gap-2
              rounded-lg border px-3 py-2
              text-[11px] font-bold text-[var(--text-primary)]
              shadow-[0_8px_20px_rgba(0,0,0,0.14)]
              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-0.5 hover:border-[var(--primary-color)]/45
              ${
                isOpen
                  ? 'border-[var(--primary-color)]/60 bg-[var(--primary-color)]/12 ring-3 ring-[var(--primary-color)]/10'
                  : 'border-[var(--border-color)] bg-[var(--soft-surface-color)]'
              }
          `}
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal
                size={13}
                className="text-[var(--primary-color)]"
              />
              {selectedOption.label}
            </span>

            <ChevronDown
              size={14}
              className={`
        text-[var(--muted-text)] transition-transform duration-300
        ${isOpen ? 'rotate-180 text-[var(--primary-color)]' : ''}
      `}
            />
          </button>

          <div
            className={`
      absolute right-0 top-[calc(100%+7px)] z-30 w-full overflow-hidden
      rounded-lg border border-[var(--border-color)]
      bg-[var(--card-surface-color)]
      p-1 shadow-[0_16px_42px_rgba(0,0,0,0.3)]
      backdrop-blur-2xl
      transition-all duration-300
      ${
        isOpen
          ? 'visible translate-y-0 scale-100 opacity-100'
          : 'invisible -translate-y-2 scale-95 opacity-0'
      }
    `}
          >
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === selectedOption.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
            cursor-pointer flex w-full items-center justify-between rounded-md px-2.5 py-2
            text-left text-[11px] font-bold transition-all duration-200
            ${
              isSelected
                ? 'bg-[var(--primary-color)] text-white shadow-[0_8px_20px_rgba(124,58,237,0.25)]'
                : 'text-[var(--muted-text)] hover:bg-[var(--soft-surface-color)] hover:text-[var(--text-primary)]'
            }
          `}
                >
                  {option.label}

                  {isSelected && (
                    <span className="size-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventFilterBar;
