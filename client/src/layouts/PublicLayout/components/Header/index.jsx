import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import { useAuthStore } from '@/stores/authStore';
import { HeaderSearch } from './components/HeaderSearch/HeaderSearch';
import HeaderLogo from './components/HeaderLogo/HeaderLogo';
import HeaderNav from './components/HeaderNav/HeaderNav';
import HeaderAuth from './components/HeaderAuth/HeaderAuth';
import HeaderThemeToggle from './components/HeaderThemeToggle/HeaderThemeToggle';
import HeaderProfileButton from './components/HeaderProfileButton/HeaderProfileButton';

function Header() {
  const visible = useHeaderVisibility();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
   <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 shadow-md bg-(--background-color)/50
      transition-transform duration-300
      ${visible ? 'translate-y-0' : '-translate-y-full'}
    `}
    >
      <HeaderLogo />
      <HeaderNav />

      <div className="flex items-center gap-8 cursor-pointer">
        <HeaderSearch />
        {isAuthenticated ? <HeaderProfileButton /> : <HeaderAuth />}
        <HeaderThemeToggle />
      </div>
    </header>
  );
}

export default Header;
