import { useHeaderVisibility } from '@/hooks/useHeaderVisibility';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { motionTransition } from '@/constants/motion';
import HeaderLogo from './components/HeaderLogo/HeaderLogo';
import HeaderNav from './components/HeaderNav/HeaderNav';
import HeaderAuth from './components/HeaderAuth/HeaderAuth';
import HeaderThemeToggle from './components/HeaderThemeToggle/HeaderThemeToggle';
import HeaderProfileButton from './components/HeaderProfileButton/HeaderProfileButton';
import MobileMenu from './components/MobileMenu/MobileMenu';
import { HeaderSearch } from './components/HeaderSearch/HeaderSearch';

const DARK_HERO_ROUTES = ['/', '/events', '/blogs', '/contact', '/search'];

function Header() {
    const { visible, scrolled } = useHeaderVisibility();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const { pathname } = useLocation();

    const isDarkHero = DARK_HERO_ROUTES.includes(pathname);

    return (
        <>
            <motion.header
                initial={{ y: -72, opacity: 0 }}
                animate={{
                    y: visible ? 0 : -84,
                    opacity: visible ? 1 : 0,
                }}
                transition={motionTransition.smooth}
                className={`
          fixed top-0 right-0 left-0 z-50
          overscroll-contain
          flex h-18 items-center justify-between
          px-3 py-2 md:px-8 md:py-3 lg:px-12 lg:py-5
          transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300
          ${
              scrolled
                  ? 'border-b border-white/10 bg-(--background-color)/80 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-2xl'
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

                    <div className="items-center hidden gap-4 lg:flex">
                        {isAuthenticated ? (
                            <HeaderProfileButton />
                        ) : (
                            <HeaderAuth />
                        )}
                    </div>

                    <motion.button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Mở menu"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        transition={motionTransition.fast}
                        className={`
              cursor-pointer rounded-full p-2 transition-colors duration-300 lg:hidden
              ${
                  scrolled
                      ? 'text-(--text-primary) hover:bg-(--primary-color-hover)'
                      : 'text-white hover:bg-white/20'
              }
            `}
                    >
                        <Menu
                            className="w-5 h-5"
                            color={
                                isDarkHero && !scrolled
                                    ? 'white'
                                    : 'var(--text-primary)'
                            }
                        />
                    </motion.button>
                </div>
            </motion.header>

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
