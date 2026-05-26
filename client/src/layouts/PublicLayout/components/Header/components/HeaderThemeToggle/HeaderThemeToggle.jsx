import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

function HeaderThemeToggle({ scrolled }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full cursor-pointer
        transition-all duration-300

        ${
          scrolled
            ? `
              bg-(--primary-color-hover)
              text-(--text-primary)
              hover:bg-(--primary-color)
            `
            : `
              bg-white/10
              text-white
              hover:bg-white/20
              backdrop-blur-xl
            `
        }
      `}
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
