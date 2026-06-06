function BlogFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="container">
      <div
        className="
          mt-6 sm:mt-10 rounded-2xl sm:rounded-[28px]
          border border-(--border-color)
          bg-(--card-surface-color) p-1.5 sm:p-2
          shadow-[0_20px_60px_rgba(0,0,0,0.22)]
          backdrop-blur-xl
          overflow-x-auto
        "
      >
        <div className="flex min-w-max gap-1.5 md:grid md:min-w-0 md:grid-cols-3 md:gap-2">
          {categories.map((category) => {
            const isActive = category.id === selectedCategory;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`
                  cursor-pointer whitespace-nowrap
                  rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3
                  text-xs sm:text-sm font-black transition-all duration-300
                  active:scale-95
                  ${
                    isActive
                      ? 'bg-(--primary-color) text-white shadow-[0_12px_35px_rgba(124,58,237,0.38)]'
                      : 'text-(--muted-text) hover:bg-(--soft-surface-color) hover:text-(--text-primary)'
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
