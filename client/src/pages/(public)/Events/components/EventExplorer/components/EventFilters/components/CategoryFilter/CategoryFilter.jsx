import CheckboxItem from '../CheckboxItem/CheckboxItem';

function CategoryFilter({ selected, onChange, categories  }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-(--text-primary)">Danh mục</span>
      <div className="flex flex-col gap-2.5">
        {categories.map((category) => (
          <CheckboxItem
            key={category.id}
            label={category.name}
            checked={selected.includes(category.id)}
            onChange={() => onChange(category.id)}  
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;