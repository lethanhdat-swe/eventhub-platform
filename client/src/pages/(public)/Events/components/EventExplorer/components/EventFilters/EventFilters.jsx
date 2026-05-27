import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Check,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { categoryService } from '@/lib/services/admin';

const INITIAL_FILTERS = {
  search: '',
  sort: '',
  date: {
    startDate: '',
    endDate: '',
  },
  selectedCategories: [],
};

const EMPTY_APPLIED_FILTERS = {
  search: '',
  sort: '',
  fromDate: '',
  toDate: '',
  categoryIds: [],
};

function EventFilters({ onApply }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.list();
        setCategoryList(response.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const updateSearch = (value) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const updateDate = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      date: {
        ...prev.date,
        [key]: value,
      },
    }));
  };

  const toggleCategory = (id) => {
    setFilters((prev) => {
      const isSelected = prev.selectedCategories.includes(id);

      return {
        ...prev,
        selectedCategories: isSelected
          ? prev.selectedCategories.filter((item) => item !== id)
          : [...prev.selectedCategories, id],
      };
    });
  };

  const handleApply = () => {
    onApply?.({
      search: filters.search,
      sort: filters.sort,
      fromDate: filters.date.startDate,
      toDate: filters.date.endDate,
      categoryIds: filters.selectedCategories,
    });
  };

  const handleClearAll = () => {
    setFilters(INITIAL_FILTERS);
    onApply?.(EMPTY_APPLIED_FILTERS);
  };

  return (
    <aside
      className="
        rounded-[24px] border border-[var(--border-color)]
        bg-[var(--card-surface-color)] p-4
        shadow-[0_20px_60px_rgba(0,0,0,0.22)]
        backdrop-blur-xl
      "
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="
              flex size-9 items-center justify-center rounded-xl
              bg-[var(--primary-color)]/12 text-[var(--primary-color)]
            "
          >
            <SlidersHorizontal size={16} />
          </div>

          <div>
            <h2 className="text-base font-black text-[var(--text-primary)]">
              Bộ lọc
            </h2>

            <p className="mt-0.5 text-xs font-medium text-[var(--muted-text)]">
              Tìm sự kiện phù hợp
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          className="
            inline-flex items-center gap-1.5 rounded-full px-3 py-2
            text-xs font-bold text-[var(--primary-color)]
            transition hover:bg-[var(--primary-color)]/10
            active:scale-95
          "
        >
          <RotateCcw size={13} />
          Xóa
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-[var(--text-primary)]">
            Tìm kiếm
          </label>

          <div
            className="
              flex items-center gap-3 rounded-xl border border-[var(--border-color)]
              bg-[var(--soft-surface-color)] px-3.5 py-3
              transition focus-within:border-[var(--primary-color)]/60
              focus-within:ring-4 focus-within:ring-[var(--primary-color)]/10
            "
          >
            <Search size={18} className="shrink-0 text-[var(--muted-text)]" />

            <input
              type="text"
              value={filters.search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Tên sự kiện..."
              className="
                w-full bg-transparent text-sm font-medium text-[var(--text-primary)]
                outline-none placeholder:text-[var(--muted-text)]
              "
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[var(--text-primary)]">
            Thời gian
          </label>

          <div className="space-y-3">
            <div
              className="
                rounded-xl border border-[var(--border-color)]
                bg-[var(--soft-surface-color)] px-3.5 py-3
                transition focus-within:border-[var(--primary-color)]/60
                focus-within:ring-4 focus-within:ring-[var(--primary-color)]/10
              "
            >
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                Từ ngày
              </p>

              <div className="flex items-center gap-3">
                <CalendarDays
                  size={16}
                  className="shrink-0 text-[var(--primary-color)]"
                />

                <input
                  type="date"
                  value={filters.date.startDate}
                  onChange={(event) =>
                    updateDate('startDate', event.target.value)
                  }
                  className="
                    w-full bg-transparent text-sm font-bold text-[var(--text-primary)]
                    outline-none [color-scheme:var(--color-scheme)]
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                    [&::-webkit-calendar-picker-indicator]:opacity-60
                  "
                />
              </div>
            </div>

            <div
              className="
                rounded-xl border border-[var(--border-color)]
                bg-[var(--soft-surface-color)] px-3.5 py-3
                transition focus-within:border-[var(--primary-color)]/60
                focus-within:ring-4 focus-within:ring-[var(--primary-color)]/10
              "
            >
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted-text)]">
                Đến ngày
              </p>

              <div className="flex items-center gap-3">
                <CalendarDays
                  size={16}
                  className="shrink-0 text-[var(--primary-color)]"
                />

                <input
                  type="date"
                  value={filters.date.endDate}
                  onChange={(event) =>
                    updateDate('endDate', event.target.value)
                  }
                  className="
                    w-full bg-transparent text-sm font-bold text-[var(--text-primary)]
                    outline-none [color-scheme:var(--color-scheme)]
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                    [&::-webkit-calendar-picker-indicator]:opacity-60
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2.5 block text-sm font-bold text-[var(--text-primary)]">
            Danh mục
          </label>

          <div className="space-y-2">
            {categoryList.length > 0 ? (
              categoryList.map((category) => {
                const isSelected = filters.selectedCategories.includes(
                  category.id
                );

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`
                      flex w-full items-center justify-between gap-3 rounded-xl
                      border px-3.5 py-3 text-left transition-all duration-300
                      ${
                        isSelected
                          ? 'border-[var(--primary-color)]/60 bg-[var(--primary-color)]/14 text-[var(--text-primary)]'
                          : 'border-[var(--border-color)] bg-[var(--soft-surface-color)] text-[var(--muted-text)] hover:border-[var(--primary-color)]/35 hover:text-[var(--text-primary)]'
                      }
                    `}
                  >
                    <span className="text-sm font-bold">{category.name}</span>

                    <span
                      className={`
                        flex size-5 items-center justify-center rounded-md border
                        ${
                          isSelected
                            ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white'
                            : 'border-[var(--border-color)] text-transparent'
                        }
                      `}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                  </button>
                );
              })
            ) : (
              <p
                className="
                  rounded-xl border border-dashed border-[var(--border-color)]
                  px-4 py-5 text-center text-sm font-medium text-[var(--muted-text)]
                "
              >
                Chưa có danh mục.
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="
            inline-flex w-full items-center justify-center rounded-xl
            bg-[var(--primary-color)] px-5 py-3.5
            text-sm font-black text-white
            shadow-[0_14px_38px_rgba(124,58,237,0.32)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(124,58,237,0.45)]
            active:scale-[0.98]
          "
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </aside>
  );
}

export default EventFilters;
