import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import { useAuthStore } from '@/stores/authStore';
import { HeaderSearch } from './components/HeaderSearch/HeaderSearch';
import HeaderLogo from './components/HeaderLogo/HeaderLogo';
import HeaderNav from './components/HeaderNav/HeaderNav';
import HeaderAuth from './components/HeaderAuth/HeaderAuth';
import HeaderThemeToggle from './components/HeaderThemeToggle/HeaderThemeToggle';
import HeaderProfileButton from './components/HeaderProfileButton/HeaderProfileButton';

function Header() {
  const { visible, scrolled } = useHeaderVisibility();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-12 py-5 h-18
        transition-all duration-300

        ${visible ? 'translate-y-0' : '-translate-y-full'}

        ${
          scrolled
            ? 'bg-[var(--background-color)]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
            : 'bg-transparent'
        }
      `}
    >
      <HeaderLogo scrolled={scrolled} />
      <HeaderNav scrolled={scrolled} />

      <div className="flex items-center gap-4 cursor-pointer">
        <HeaderSearch />
        <HeaderThemeToggle scrolled={scrolled} />
        {isAuthenticated ? <HeaderProfileButton /> : <HeaderAuth />}
      </div>
    </header>
  );
}

export default Header;
