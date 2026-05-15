import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

function HeaderThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="ml-6 p-2 rounded-full bg-(--primary-color) text-(--text-primary) hover:bg-(--primary-color-hover) transition-colors duration-300"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

export default HeaderThemeToggle;