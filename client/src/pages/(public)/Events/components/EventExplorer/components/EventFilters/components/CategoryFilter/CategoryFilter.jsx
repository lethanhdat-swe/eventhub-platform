import { useState } from 'react';
import CheckboxItem from '../CheckboxItem/CheckboxItem';

const ALL_CATEGORIES = [
  { label: 'Music', count: 245 },
  { label: 'Festivals', count: 128 },
  { label: 'Sports', count: 82 },
  { label: 'Theater', count: 64 },
  { label: 'Comedy', count: 53 },
  { label: 'Art & Culture', count: 41 },
  { label: 'Food & Drink', count: 29 },
];

const DEFAULT_VISIBLE = 5;
function CategoryFilter({ selected, onChange }) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll
    ? ALL_CATEGORIES
    : ALL_CATEGORIES.slice(0, DEFAULT_VISIBLE);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-(--text-primary)">Categories</span>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-(--primary-color) transition-colors hover:text-(--primary-color)/90"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {visible.map(({ label, count }) => (
          <CheckboxItem
            key={label}
            label={label}
            count={count}
            checked={selected.includes(label)}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
