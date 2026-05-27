function BlogFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="container">
      <div
        className="
          mt-10 rounded-[28px]
          border border-[var(--border-color)]
          bg-[var(--card-surface-color)] p-2
          shadow-[0_20px_60px_rgba(0,0,0,0.22)]
          backdrop-blur-xl
        "
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {categories.map((category) => {
            const isActive = category.id === selectedCategory;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`
                  cursor-pointer
                  rounded-2xl px-5 py-3
                  text-sm font-black transition-all duration-300
                  active:scale-95
                  ${
                    isActive
                      ? 'bg-[var(--primary-color)] text-white shadow-[0_12px_35px_rgba(124,58,237,0.38)]'
                      : 'text-[var(--muted-text)] hover:bg-[var(--soft-surface-color)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BlogFilter;
