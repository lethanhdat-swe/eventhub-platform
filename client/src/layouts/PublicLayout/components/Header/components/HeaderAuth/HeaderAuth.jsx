function HeaderAuth() {
  return (
    <div className="flex items-center gap-4">
      <button
        className="px-5 py-2 text-gray-600 font-medium hover:text-(--primary-color) 
        transition-colors duration-300 cursor-pointer relative 
        after:content-[''] after:absolute after:bottom-1 after:left-1/2 
        after:w-0 after:h-0.5 after:bg-(--primary-color) 
        after:transition-all hover:after:w-1/2 hover:after:left-1/4"
      >
        Sign Up
      </button>

      <button
        className="px-6 py-2 bg-(--primary-color) text-white font-semibold rounded-full 
        shadow-[0_4px_14px_0_var(--primary-color)] opacity-90 hover:opacity-100 
        hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] 
        transition-all duration-300 cursor-pointer"
      >
        Sign In
      </button>
    </div>
  );
}

export default HeaderAuth;