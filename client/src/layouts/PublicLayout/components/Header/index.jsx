import { Search, ShoppingCart, Sparkle } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-10 shadow-md">
      <div className="flex items-center gap-2">
        <Sparkle color="var(--primary-color)" />
        <Link to={'/'} className="text-xl font-bold text-(--text-primary)">
          PornHub
        </Link>
      </div>
      <nav>
        <ul className="flex gap-10">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group relative py-2 text-xl font-medium transition-colors duration-300 
                                     ${isActive ? 'text-(--primary-color) is-active' : 'text-(--text-primary) hover:text-(--primary-color)'}`
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

      <div className="flex items-center gap-8 cursor-pointer">
        <Search color="white" />
        <ShoppingCart color="white" />

        <div className="flex items-center gap-4">
          <button className="px-5 py-2 text-gray-600 font-medium hover:text-(--primary-color) transition-colors duration-300 cursor-pointer relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-(--primary-color) after:transition-all hover:after:w-1/2 hover:after:left-1/4">
            Sign Up
          </button>

          <button className="px-6 py-2 bg-(--primary-color) text-white font-semibold rounded-full shadow-[0_4px_14px_0_var(--primary-color)] opacity-90 hover:opacity-100 hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
