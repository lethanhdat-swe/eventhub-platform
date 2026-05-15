import { NavLink } from 'react-router-dom';

function HeaderNav() {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Blog', path: '/blogs' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav>
      <ul className="flex gap-10">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `group relative py-2 text-[18px] font-medium transition-colors duration-300 
                ${
                  isActive
                    ? 'text-(--primary-color) is-active'
                    : 'text-(--text-primary) hover:text-(--primary-color)'
                }`
              }
            >
              {item.label}

              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-(--primary-color) transition-all duration-300 
                w-0 
                group-hover:w-full 
                in-[[.is-active]]:w-full`}
              />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HeaderNav;