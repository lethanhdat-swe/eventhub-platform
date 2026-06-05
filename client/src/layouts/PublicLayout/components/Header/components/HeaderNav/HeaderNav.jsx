import { NavLink, useLocation } from 'react-router-dom';

const DARK_HERO_ROUTES = ['/', '/events', '/blogs', '/contact', '/search'];

function HeaderNav({ scrolled }) {
  const { pathname } = useLocation();
  const isDarkHero = DARK_HERO_ROUTES.includes(pathname);

  const navItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sự kiện', path: '/events' },
    { label: 'Bài viết', path: '/blogs' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  return (
    <nav>
      <ul className="flex gap-10 ml-10">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `group relative py-2 text-[17px] font-medium transition-colors duration-300 
                ${
                  isActive
                    ? 'text-(--primary-color) is-active'
                    : isDarkHero && !scrolled
                      ? 'text-white hover:text-(--primary-color)'
                      : 'text-(--text-primary) hover:text-(--primary-color)'
                }`
              }
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-(--primary-color) transition-all duration-300 
                w-0 group-hover:w-full in-[[.is-active]]:w-full`}
              />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HeaderNav;