import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { motionTransition } from '@/constants/motion';

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
    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <motion.p
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          x: motionTransition.smooth,
          opacity: motionTransition.opacity,
        }}
        className="min-w-0 text-sm font-medium text-[var(--muted-text)]"
      >
        Tìm thấy{' '}
        <span className="font-black text-[var(--primary-color)]">
          {totalEvents}
        </span>{' '}
        sự kiện phù hợp
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: 14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          x: motionTransition.smooth,
          opacity: motionTransition.opacity,
        }}
        className="flex items-center gap-2"
      >
        <div ref={dropdownRef} className="relative">
          <motion.button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={motionTransition.fast}
            className={`
              group inline-flex min-w-[132px] cursor-pointer items-center justify-between gap-2
              rounded-lg border px-3 py-2
              text-[11px] font-bold text-[var(--text-primary)]
              shadow-[0_8px_20px_rgba(0,0,0,0.14)]
              backdrop-blur-xl
              transition-colors duration-300
              hover:border-[var(--primary-color)]/45
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
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={motionTransition.fast}
                className="
                  absolute right-0 top-[calc(100%+7px)] z-30 w-full overflow-hidden
                  rounded-lg border border-[var(--border-color)]
                  bg-[var(--card-surface-color)]
                  p-1 shadow-[0_16px_42px_rgba(0,0,0,0.3)]
                  backdrop-blur-2xl
                "
              >
                {SORT_OPTIONS.map((option) => {
                  const isSelected = option.value === selectedOption.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`
                        flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2
                        text-left text-[11px] font-bold transition-colors duration-200
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default EventFilterBar;
