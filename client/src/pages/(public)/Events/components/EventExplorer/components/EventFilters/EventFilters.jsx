import { useState } from 'react';
import FilterHeader from './components/FilterHeader/FilterHeader';
import SearchInput from './components/SearchInput/SearchInput';
import LocationSelect from './components/LocationSelect/LocationSelect';
import DatePicker from './components/DatePicker/DatePicker';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import PriceRangeSlider from './components/PriceRangeSlider/PriceRangeSlider';
import EventTypeFilter from './components/EventTypeFilter/EventTypeFilter';
import ApplyButton from './components/ApplyButton/ApplyButton';

function EventFilters() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [date, setDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['Music']);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedEventTypes, setSelectedEventTypes] = useState([
    'Online Events',
    'Offline Events',
  ]);

  const toggleItem = (setter) => (label) => {
    setter((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const clearAll = () => {
    setSearch('');
    setLocation('All Locations');
    setDate('');
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedEventTypes([]);
  };

  const handleApply = () => {
    console.log({
      search,
      location,
      date,
      selectedCategories,
      priceRange,
      selectedEventTypes,
    });

    clearAll();
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col w-full gap-5 p-5 bg-(--surface-color) shadow-2xl rounded-l-2xl">
        <FilterHeader onClearAll={clearAll} />
        <SearchInput value={search} onChange={setSearch} />
        <LocationSelect value={location} onChange={setLocation} />
        <DatePicker value={date} onChange={setDate} />
        <CategoryFilter
          selected={selectedCategories}
          onChange={toggleItem(setSelectedCategories)}
        />
        <PriceRangeSlider value={priceRange} onChange={setPriceRange} />
        <EventTypeFilter
          selected={selectedEventTypes}
          onChange={toggleItem(setSelectedEventTypes)}
        />
        <ApplyButton onClick={handleApply} />
      </div>
    </div>
  );
}

export default EventFilters;
