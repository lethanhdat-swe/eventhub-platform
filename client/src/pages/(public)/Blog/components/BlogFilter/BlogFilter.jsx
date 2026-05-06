function BlogFilter() {
    const CATEGORIES = [
    { label: 'All', active: true },
    { label: 'News', active: false },
    { label: 'Event Reviews', active: false },
    { label: 'Guides', active: false },
    { label: 'Interview', active: false },
    { label: 'Tip & Tricks', active: false },
  ];

    return ( 
        <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-4xl mt-5 p-5 container">
            <div className="flex items-center justify-around">
                {CATEGORIES.map((category) => (
                <p key={category.label} className={`px-4 py-2 rounded-2xl flex items-center justify-center text-xl
              transition-all duration-300
                    ${category.active ? 'text-(--text-primary) scale-105 shadow-lg shadow-purple-500/30 bg-(--primary-color)'
                            : 'bg-(--background-color)/70 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-(--text-primary) hover:scale-105'}
                    `}>{category.label}</p>
            ))}
            </div>
        </div>
     );
}

export default BlogFilter;