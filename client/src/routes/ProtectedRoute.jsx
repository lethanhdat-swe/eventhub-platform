import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { isAdminUser } from '@/lib/auth/authRole';
import { useAuthStore } from '@/stores/authStore';

function ProtectedRoute() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const syncSessionFromServer = useAuthStore((s) => s.syncSessionFromServer);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      setIsVerifying(false);
      setIsAuthorized(false);
      return;
    }

    let ignore = false;

    async function verifyAdminSession() {
      setIsVerifying(true);

      try {
        const sessionUser = await syncSessionFromServer();
        if (ignore) return;

        setIsAuthorized(isAdminUser(sessionUser));
      } catch {
        if (!ignore) {
          setIsAuthorized(false);
        }
      } finally {
        if (!ignore) {
          setIsVerifying(false);
        }
      }
    }

    void verifyAdminSession();

    return () => {
      ignore = true;
    };
  }, [isHydrated, isAuthenticated, syncSessionFromServer]);

  if (!isHydrated || isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized || !isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
