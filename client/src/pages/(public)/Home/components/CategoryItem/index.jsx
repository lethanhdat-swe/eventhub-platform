import {
  Balloon,
  Coffee,
  Drama,
  Ellipsis,
  Music,
  Palette,
  Smile,
  Trophy,
} from 'lucide-react';

function CategoryItem() {
  const CATEGORIES = [
    { icon: <Music />, label: 'Music', active: true },
    { icon: <Balloon />, label: 'Festivals', active: false },
    { icon: <Trophy />, label: 'Sports', active: false },
    { icon: <Drama />, label: 'Theater', active: false },
    { icon: <Smile />, label: 'Comedy', active: false },
    { icon: <Palette />, label: 'Art & Culture', active: false },
    { icon: <Coffee />, label: 'Food & Drink', active: false },
    { icon: <Ellipsis />, label: 'More', active: false },
  ];

  return (
    <div className="container flex items-center px-8 py-4 justify-evenly">
      {CATEGORIES.map(({ icon, label, active }) => (
        <button
          key={label}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
              transition-all duration-300
              ${
                active
                  ? 'text-white scale-105 shadow-lg shadow-purple-500/30 bg-(--primary-color)'
                  : 'bg-(--background-color)/70 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'
              }`}
          >
            {icon}
          </div>

          <span
            className={`text-xs font-medium transition-colors duration-300
              ${
                active
                  ? 'text-white'
                  : 'text-gray-500 group-hover:text-gray-300'
              }`}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default CategoryItem;
