import { Link, useLocation } from 'react-router-dom';
import HeaderLogo from '@/layouts/PublicLayout/components/Header/components/HeaderLogo/HeaderLogo';
import HeaderThemeToggle from '@/layouts/PublicLayout/components/Header/components/HeaderThemeToggle/HeaderThemeToggle';

function Header() {
  const { pathname } = useLocation();

  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  return (
    <header className="relative z-20 border-b border-(--border-color) bg-(--background-color)/80 backdrop-blur-2xl">
      <div className="px-10 flex h-18 items-center justify-between">
        <HeaderLogo scrolled />

        <div className="flex items-center gap-3">
          <HeaderThemeToggle scrolled />

          <nav
            aria-label="Tài khoản"
            className="hidden items-center gap-2 text-sm font-semibold sm:flex"
          >
            {!isLoginPage && (
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-(--muted-text) transition-colors duration-300 hover:bg-(--soft-surface-color) hover:text-(--text-primary)"
              >
                Đăng nhập
              </Link>
            )}

            {!isRegisterPage && (
              <Link
                to="/register"
                className="rounded-full bg-(--primary-color) px-4 py-2 text-white transition-transform duration-300 hover:scale-105"
              >
                Đăng ký
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
