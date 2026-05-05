function NavColumn() {
  const NAV_LINKS = {
    Explore: [
      { label: 'Events', path: '/events' },
      { label: 'Venues', path: '/venues' },
      { label: 'Artists', path: '/artists' },
      { label: 'Categories', path: '/categories' },
    ],
    Support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Refund Policy', path: '/refund' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Blog', path: '/blog' },
      { label: 'Contact Us', path: '/contact' },
    ],
  };

  return (
    <footer className="grid grid-cols-3 gap-10">
      {Object.entries(NAV_LINKS).map(([title, links]) => (
        <div key={title} className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-(--text-primary) uppercase tracking-wider">
            {title}
          </h3>

          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.path}
                  className="text-gray-500 hover:text-(--primary-color) transition-all duration-300 flex items-center group"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </footer>
  );
}

export default NavColumn;
