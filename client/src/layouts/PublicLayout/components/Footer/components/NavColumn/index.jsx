import { Link } from 'react-router-dom';

function NavColumn() {
  const NAV_LINKS = {
    'Khám phá': [
      { label: 'Sự kiện', path: '/events' },
      { label: 'Địa điểm', path: '/venues' },
      { label: 'Nghệ sĩ', path: '/artists' },
      { label: 'Danh mục', path: '/categories' },
    ],
    'Hỗ trợ': [
      { label: 'Trung tâm trợ giúp', path: '/help' },
      { label: 'Điều khoản sử dụng', path: '/terms' },
      { label: 'Chính sách bảo mật', path: '/privacy' },
      { label: 'Chính sách hoàn vé', path: '/refund' },
    ],
    EventHub: [
      { label: 'Về chúng tôi', path: '/about' },
      { label: 'Tuyển dụng', path: '/careers' },
      { label: 'Bài viết', path: '/blogs' },
      { label: 'Liên hệ', path: '/contact' },
    ],
  };

  return (
    // 1 cột trên mobile, 3 cột từ sm+
    <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
      {Object.entries(NAV_LINKS).map(([title, links]) => (
        <div key={title}>
          <h3 className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-(--text-primary)">
            {title}
          </h3>
          <ul className="space-y-2.5">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className="
                    group inline-flex text-sm font-medium
                    text-(--muted-text)
                    transition-colors duration-300
                    hover:text-(--primary-color)
                  "
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default NavColumn;
