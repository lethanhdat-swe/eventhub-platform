import { Navigate, Outlet } from 'react-router-dom';

import { isAdminUser } from '@/lib/auth/authRole';
import { useAuthStore } from '@/stores/authStore';

function ProtectedRoute() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
