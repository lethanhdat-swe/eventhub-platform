// components/MobileMenu/MobileMenu.jsx
import { X } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkle } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeaderProfileButton from '../HeaderProfileButton/HeaderProfileButton';
import { siteSettingService } from '@/lib/services/siteSetting';
import { getUploadPreviewSrc } from '@/lib/upload/uploadAsset';

const navItems = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sự kiện', path: '/events' },
  { label: 'Bài viết', path: '/blogs' },
  { label: 'Liên hệ', path: '/contact' },
];

function MobileMenu({ open, onClose, isAuthenticated }) {
    const [siteSetting, setSiteSetting] = useState({ websiteName: 'EventHub', logoUrl: '' });
    
      useEffect(() => {
        const fetchSiteSetting = async () => {
          try {
            const data = await siteSettingService.getSiteSetting();
            if (data) setSiteSetting(data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchSiteSetting();
      }, []);

  // Lock body scroll khi sidebar mở
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
            fixed top-0 right-0 z-50 h-full w-72
            flex flex-col
            bg-(--background-color)
            border-l border-white/10
            transition-transform duration-300 ease-in-out
            lg:hidden
            ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!open}
        >
        {/* Header sidebar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            {siteSetting.logoUrl ? (
                    <img
                      src={getUploadPreviewSrc(siteSetting.logoUrl)}
                      alt={siteSetting.websiteName}
                      className="object-contain w-15 h-15"
                    />
                  ) : (
                    <Sparkle color="var(--primary-color)" />
                  )}
            
                  <Link
                    to="/"
                    className={`
                      text-xl font-bold transition-colors duration-300 text-(--text-primary)
                    `}
                  >
                    {siteSetting.websiteName}
                  </Link>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="p-2 rounded-full text-(--text-primary) hover:bg-(--primary-color-hover) transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-(--primary-color)/10 text-(--primary-color)'
                        : 'text-(--text-primary) hover:bg-(--primary-color)/8 hover:text-(--primary-color)'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth section ở dưới cùng */}
        <div className="px-4 py-5 border-t border-white/10">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <HeaderProfileButton />
              <span className="text-sm text-(--muted-text)">Tài khoản của bạn</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full text-center px-6 py-2.5 bg-(--primary-color) text-white font-semibold rounded-full
                  shadow-[0_4px_14px_0_var(--primary-color)] opacity-90 hover:opacity-100
                  transition-all duration-300"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="w-full text-center px-6 py-2.5 rounded-full border border-(--primary-color)/40
                  text-(--primary-color) font-medium hover:bg-(--primary-color)/8
                  transition-all duration-300"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default MobileMenu;