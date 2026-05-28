import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import { useAuthStore } from '@/stores/authStore';
import { HeaderSearch } from './components/HeaderSearch/HeaderSearch';
import HeaderLogo from './components/HeaderLogo/HeaderLogo';
import HeaderNav from './components/HeaderNav/HeaderNav';
import HeaderAuth from './components/HeaderAuth/HeaderAuth';
import HeaderThemeToggle from './components/HeaderThemeToggle/HeaderThemeToggle';
import HeaderProfileButton from './components/HeaderProfileButton/HeaderProfileButton';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import MobileMenu from './components/MobileMenu/MobileMenu';
import { useLocation } from 'react-router-dom';

function Header() {
  const { visible, scrolled } = useHeaderVisibility();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { pathname } = useLocation();
  const DARK_HERO_ROUTES = ['/', '/events', '/blogs', '/contact'];
  const isDarkHero = DARK_HERO_ROUTES.includes(pathname);

  return (
    <>
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        md:px-12 md:py-5 h-18 p-2
        transition-all duration-300

        ${visible ? 'translate-y-0' : '-translate-y-full'}

        ${
          scrolled
            ? 'bg-(--background-color)/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
            : 'bg-transparent'
        }
      `}
    >
      <HeaderLogo scrolled={scrolled} />
      <div className="hidden lg:block">
          <HeaderNav scrolled={scrolled} />
        </div>

      <div className="flex items-center gap-3">
          <HeaderSearch />
          <HeaderThemeToggle scrolled={scrolled} />

          {/* Auth / Profile — ẩn trên < lg, hiện trong sidebar */}
          <div className="items-center hidden gap-4 lg:flex">
            {isAuthenticated ? <HeaderProfileButton /> : <HeaderAuth />}
          </div>

          {/* Hamburger — chỉ hiện trên < lg */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu"
            className={`
              lg:hidden p-2 rounded-full transition-all duration-300 cursor-pointer
              ${
                scrolled
                  ? 'text-(--text-primary) hover:bg-(--primary-color-hover)'
                  : 'text-white hover:bg-white/20'
              }
            `}
          >
           <Menu
            className="w-5 h-5"
            color={isDarkHero && !scrolled ? 'white' : 'var(--text-primary)'}
          />
          </button>
        </div>
    </header>

    {/* Mobile sidebar */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        scrolled={scrolled}
        isAuthenticated={isAuthenticated}
      />
      </>
  );
}

export default Header;
