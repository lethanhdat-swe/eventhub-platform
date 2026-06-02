import { useState } from 'react';
import { toast } from 'sonner';

import { authService } from '@/lib/services/auth';
import { signInWithGoogle } from '@/lib/firebase/googleAuth';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { mapGoogleLoginError, mapLoginApiError } from '@/utils/loginErrorMapper';

export function useLogin(setAuth, redirectAfterLogin) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  async function login(payload) {
    setApiError('');
    setLoading(true);

    try {
      const body = await authService.login(payload);

      const data = getApiData(body);

      setAuth(data);

      toast.success('Đăng nhập thành công.');

      redirectAfterLogin(data);
    } catch (e) {
      const message = mapLoginApiError(e);

      setApiError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    setApiError('');
    setGoogleLoading(true);

    try {
      const { idToken } = await signInWithGoogle();

      const body = await authService.googleLogin({
        idToken,
      });

      const data = getApiData(body);

      setAuth(data);

      toast.success('Đăng nhập Google thành công.');

      redirectAfterLogin(data);
    } catch (e) {
      const message = mapGoogleLoginError(e);

      setApiError(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return {
    login,
    googleLogin,
    loading,
    googleLoading,
    apiError,
    setApiError,
  };
}