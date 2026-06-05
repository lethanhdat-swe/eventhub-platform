import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchInputSection({ keyword }) {
  const [value, setValue] = useState(keyword || '');
  const navigate = useNavigate();

  useEffect(() => {
    setValue(keyword || '');
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = value.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  return (
    <section className="container relative z-10 -mt-10 mb-2">
      <form
        onSubmit={handleSubmit}
        className="
          group flex flex-col gap-3 rounded-2xl border border-(--border-color)
          bg-(--surface-color) p-3 shadow-[0_20px_60px_rgba(0,0,0,0.18)]
          sm:flex-row sm:items-center sm:gap-4 sm:p-4
        "
      >
        <div
          className="
            flex flex-1 items-center gap-3 rounded-xl border border-(--border-color)
            bg-(--soft-surface-color) px-4 py-3 transition-all duration-300
            focus-within:border-(--primary-color)/50
            focus-within:shadow-[0_0_30px_rgba(124,58,237,0.15)]
          "
        >
          <Search
            size={18}
            className="shrink-0 text-(--primary-color) transition-transform duration-300 group-focus-within:scale-110"
          />

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Tìm sự kiện, nghệ sĩ, địa điểm..."
            className="
              min-w-0 flex-1 bg-transparent text-sm text-(--text-primary)
              outline-none placeholder:text-(--muted-text)
            "
          />

          {value && (
            <button
              type="button"
              onClick={() => setValue('')}
              className="
                shrink-0 rounded-full p-1 text-(--muted-text)
                transition-all hover:bg-(--text-primary)/5 hover:text-(--text-primary)
              "
              aria-label="Xóa từ khóa"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="
            inline-flex h-11 items-center justify-center rounded-xl
            bg-(--primary-color) px-6 text-sm font-semibold text-white
            transition-all duration-300 hover:opacity-90 hover:scale-[1.02]
            sm:h-12 sm:shrink-0
          "
        >
          Tìm kiếm
        </button>
      </form>
    </section>
  );
}

export default SearchInputSection;
