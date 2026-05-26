import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export function SearchDropdown({ open, value, onChange, onSubmit, inputRef }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: -12,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -8,
            scale: 0.97,
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
          className="
            absolute right-0 top-12 z-50 w-[380px]
            rounded-3xl border border-white/10
            bg-[var(--surface-color)]/90
            p-3
            shadow-[0_20px_80px_rgba(0,0,0,0.45)]
            backdrop-blur-2xl
          "
        >
          <form
            onSubmit={onSubmit}
            className="
              group flex items-center gap-3
              rounded-2xl border border-white/10
              bg-black/20
              px-4 py-2
              transition-all duration-300
              focus-within:border-[var(--primary-color)]/50
              focus-within:shadow-[0_0_30px_rgba(124,58,237,0.18)]
            "
          >
            <Search
              size={18}
              className="
                text-[var(--primary-color)]
                transition-transform duration-300
                group-focus-within:scale-110
              "
            />

            <input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Tìm sự kiện, nghệ sĩ, địa điểm..."
              className="
                min-w-0 flex-1 bg-transparent
                text-sm text-[var(--text-primary)]
                outline-none
                placeholder:text-gray-500
              "
            />

            <AnimatePresence mode="wait">
              {value && (
                <motion.button
                  key="clear"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  onClick={() => onChange('')}
                  className="
                    rounded-full p-1
                    text-[var(--text-primary)]/40
                    transition-all
                    hover:bg-white/5
                    hover:text-[var(--text-primary)]
                  "
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
