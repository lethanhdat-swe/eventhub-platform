function FilterHeader({ onClearAll }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold tracking-wide text-(--text-primary)">
        Filter Events
      </span>
      <button
        onClick={onClearAll}
        className="cursor-pointer text-sm font-medium text-(--primary-color) transition-colors hover:text-(--primary-color)/90"
      >
        Clear All
      </button>
    </div>
  );
}

export default FilterHeader;
