import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authStorage } from '@/lib/auth/authStorage';
import { authService } from '@/lib/services/auth/authService';
import { useAuthStore } from '@/stores/authStore';
import { LayoutDashboard, Loader2, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function HeaderProfileButton() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getMe();

        const userData = res?.data;

        if (!userData) return;

        useAuthStore.setState((state) => ({
          ...state,
          user: {
            ...state.user,
            ...userData,
          },
        }));
      } catch (error) {
        console.log(error);
      }
    };

    if (!user?.avatarUrl) {
      fetchUser();
    }
  }, [user?.avatarUrl]);

  const initials =
    user?.fullName
      ?.trim()
      ?.split(' ')
      ?.slice(-1)?.[0]
      ?.charAt(0)
      ?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    'U';

  const avatarUrl = user?.avatarUrl
    ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}`
    : null;

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const refreshToken =
        useAuthStore.getState().refreshToken ?? authStorage.getRefreshToken();

      if (refreshToken) {
        try {
          await authService.logout({ refreshToken });
        } catch {
          /* vẫn clear local */
        }
      }
    } finally {
      useAuthStore.getState().clearAuth();
      navigate('/login');
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoggingOut}>
        <div
          type="button"
          disabled={isLoggingOut}
          className="
            group relative grid size-11 place-items-center rounded-full
            cursor-pointer border border-white/10 bg-white/4
            transition-all duration-300
            hover:border-(--primary-color)/40
            hover:bg-(--primary-color)/10
            hover:shadow-[0_0_24px_rgba(124,58,237,0.22)]
            active:scale-95
            disabled:pointer-events-none disabled:opacity-50
          "
        >
          <span
            className="
              absolute inset-0 rounded-full
              bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.28),transparent_70%)]
              opacity-0 blur-md
              transition-opacity duration-300
              group-hover:opacity-100
            "
          />

          <span
            className="
              relative grid size-9 place-items-center overflow-hidden rounded-full
              bg-[linear-gradient(135deg,#7c3aed,#a855f7)]
              text-sm font-bold text-white
              shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_18px_rgba(124,58,237,0.22)]
            "
          >
            {avatarUrl ? (
              <img
                src={resolvePublicAssetUrl(user.avatarUrl)}
                alt={user.fullName}
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full"
              />
            ) : (
              initials
            )}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          w-56 rounded-xl border border-white/10
          bg-[#111114]/95 p-1 text-white
          shadow-[0_16px_50px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
        "
      >
        {/* User Info */}
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div
            className="
              grid size-8 shrink-0 place-items-center overflow-hidden rounded-full
              bg-[linear-gradient(135deg,#7c3aed,#a855f7)]
              text-xs font-bold text-white
            "
          >
            {avatarUrl ? (
              <img
                src={resolvePublicAssetUrl(user.avatarUrl)}
                alt={user?.fullName || 'Avatar'}
                className="object-cover w-full h-full"
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.fullName || 'Người dùng'}
            </p>

            <p className="text-xs truncate text-white/40">{user?.email}</p>
          </div>
        </div>

        <div className="h-px my-1 bg-white/10" />

        {/* Profile */}
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="
              flex items-center gap-2 rounded-lg
              px-2.5 py-2 text-sm
              text-white/75
              transition-colors
              hover:bg-white/6
              hover:text-white
              focus:bg-white/6
            "
          >
            <User size={15} className="text-white/45" />
            Trang cá nhân
          </Link>
        </DropdownMenuItem>

        {/* Admin */}
        {user?.role === 'ADMIN' && (
          <DropdownMenuItem asChild>
            <Link
              to="/admin"
              className="
                flex items-center gap-2 rounded-lg
                px-2.5 py-2 text-sm
                text-white/75
                transition-colors
                hover:bg-white/6
                hover:text-white
                focus:bg-white/6
              "
            >
              <LayoutDashboard size={15} className="text-white/45" />
              Trang quản trị
            </Link>
          </DropdownMenuItem>
        )}

        {/* Logout */}
        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={() => void handleLogout()}
          className="
            flex cursor-pointer items-center gap-2 rounded-lg
            px-2.5 py-2 text-sm
            text-red-400 transition-colors
            disabled:pointer-events-none
            disabled:opacity-50
          "
        >
          {isLoggingOut ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <LogOut size={15} />
          )}

          {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeaderProfileButton;
