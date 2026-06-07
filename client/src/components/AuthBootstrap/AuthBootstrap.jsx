import { useEffect } from 'react';

import { useAuthStore } from '@/stores/authStore';

function AuthBootstrap({ children }) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const bootstrapAuth = useAuthStore((s) => s.bootstrapAuth);

  useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  return children;
}

export default AuthBootstrap;
