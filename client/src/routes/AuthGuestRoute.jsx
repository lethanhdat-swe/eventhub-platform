import { Navigate, Outlet } from 'react-router-dom';

import { isAdminUser } from '@/lib/auth/authRole';
import { useAuthStore } from '@/stores/authStore';

/**
 * Chỉ cho phép khách (chưa đăng nhập) vào các trang auth.
 * Đã đăng nhập thì chuyển hướng về khu vực phù hợp.
 */
function AuthGuestRoute() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  if (isAuthenticated) {
    const to = isAdminUser(user) ? '/admin/dashboard' : '/';
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}

export default AuthGuestRoute;
