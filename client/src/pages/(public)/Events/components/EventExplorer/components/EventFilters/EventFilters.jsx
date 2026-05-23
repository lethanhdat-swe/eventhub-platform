import { useEffect, useState } from 'react';
import FilterHeader from './components/FilterHeader/FilterHeader';
import SearchInput from './components/SearchInput/SearchInput';
import DatePicker from './components/DatePicker/DatePicker';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import ApplyButton from './components/ApplyButton/ApplyButton';
import { categoryService } from '@/lib/services/admin';

const INITIAL_FILTERS = {
  search: '',
  sort: '',
  date: { startDate: '', endDate: '' },
  selectedCategories: [],
};

function EventFilters({ onApply }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.list();
        setCategoryList(data.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  const update = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (id) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter((i) => i !== id)
        : [...prev.selectedCategories, id],
    }));
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
    onApply?.(INITIAL_FILTERS);  
  };

  return (
    <div className="flex items-start justify-center h-full">
      <div className="flex flex-col w-full gap-5 p-5 bg-(--surface-color) shadow-2xl rounded-l-2xl">
        <FilterHeader onClearAll={handleClearAll} />
        <SearchInput value={filters.search} onChange={update('search')} />
        <DatePicker value={filters.date} onChange={update('date')} />
        <CategoryFilter
          selected={filters.selectedCategories}
          onChange={toggleCategory}
          categories={categoryList}
        />
        <ApplyButton onClick={handleApply} />
      </div>
    </div>
  );
}

export default EventFilters;