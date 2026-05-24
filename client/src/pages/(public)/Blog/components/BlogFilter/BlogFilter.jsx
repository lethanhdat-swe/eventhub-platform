function BlogFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-4xl mt-5 p-5 container">
      <div className="flex items-center justify-around flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = category.id === selectedCategory;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-4 py-2 rounded-2xl flex items-center justify-center text-xl
                            transition-all duration-300 cursor-pointer border-0 outline-hidden
                            ${
                              isActive
                                ? 'text-(--text-primary) scale-105 shadow-lg shadow-purple-500/30 bg-(--primary-color)'
                                : 'bg-(--background-color)/70 border border-(--text-primary)/10 text-gray-400 hover:bg-(--text-primary)/10 hover:text-(--text-primary) hover:scale-105'
                            }
                            `}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BlogFilter;
