import { useEffect, useState } from 'react';
import { Check, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { categoryService } from '@/lib/services/admin';
import FilterDateField from './components/DatePicker/FilterDateField';

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
        rounded-[24px] border border-(--border-color)
        bg-(--card-surface-color) p-4
        shadow-[0_20px_60px_rgba(0,0,0,0.22)]
        backdrop-blur-xl
      "
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="
              flex size-9 items-center justify-center rounded-xl
              bg-(--primary-color)/12 text-(--primary-color)
            "
          >
            <SlidersHorizontal size={16} />
          </div>

          <div>
            <h2 className="text-base font-black text-(--text-primary)">
              Bộ lọc
            </h2>

            <p className="mt-0.5 text-xs font-medium text-(--muted-text)">
              Tìm sự kiện phù hợp
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          className="
            inline-flex items-center gap-1.5 rounded-full px-3 py-2
            text-xs font-bold text-(--primary-color)
            transition hover:bg-(--primary-color)/10
            active:scale-95
          "
        >
          <RotateCcw size={13} />
          Xóa
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-(--text-primary)">
            Tìm kiếm
          </label>

          <div
            className="
              flex items-center gap-3 rounded-xl border border-(--border-color)
              bg-(--soft-surface-color) px-3.5 py-3
              transition focus-within:border-(--primary-color)/60
              focus-within:ring-4 focus-within:ring-(--primary-color)/10
            "
          >
            <Search size={18} className="shrink-0 text-(--muted-text)" />

            <input
              type="text"
              value={filters.search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Tên sự kiện..."
              className="
                w-full bg-transparent text-sm font-medium text-(--text-primary)
                outline-none placeholder:text-(--muted-text)
              "
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-(--text-primary)">
            Thời gian
          </label>

          <div className="space-y-3">
            <FilterDateField
              label="Từ ngày"
              value={filters.date.startDate}
              max={filters.date.endDate || undefined}
              onChange={(nextValue) => updateDate('startDate', nextValue)}
            />

            <FilterDateField
              label="Đến ngày"
              value={filters.date.endDate}
              min={filters.date.startDate || undefined}
              onChange={(nextValue) => updateDate('endDate', nextValue)}
            />
          </div>
        </div>

        <div>
          <label className="mb-2.5 block text-sm font-bold text-(--text-primary)">
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
                          ? 'border-(--primary-color)/60 bg-(--primary-color)/14 text-(--text-primary)'
                          : 'border-(--border-color) bg-(--soft-surface-color) text-(--muted-text) hover:border-(--primary-color)/35 hover:text-(--text-primary)'
                      }
                    `}
                  >
                    <span className="text-sm font-bold">{category.name}</span>

                    <span
                      className={`
                        flex size-5 items-center justify-center rounded-md border
                        ${
                          isSelected
                            ? 'border-(--primary-color) bg-(--primary-color) text-white'
                            : 'border-(--border-color) text-transparent'
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
                  rounded-xl border border-dashed border-(--border-color)
                  px-4 py-5 text-center text-sm font-medium text-(--muted-text)
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
            bg-(--primary-color) px-5 py-3.5
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
