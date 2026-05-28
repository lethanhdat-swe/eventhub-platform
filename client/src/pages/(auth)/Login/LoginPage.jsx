import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { isAdminUser } from '@/lib/auth/authRole';
import { signInWithGoogle } from '@/lib/firebase/googleAuth';
import { parseApiError } from '@/lib/http/apiError';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { authService } from '@/lib/services/auth';
import { useAuthStore } from '@/stores/authStore';
import GoogleAuthButton from '../components/GoogleAuthButton/GoogleAuthButton';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mapLoginApiError(error) {
  const parsed = parseApiError(error);
  const status = parsed.status;
  const msg = (parsed.message || '').trim();

  if (status === 403) {
    if (msg.toLowerCase().includes('verify your email')) {
      return 'Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư và bấm liên kết kích hoạt tài khoản.';
    }
  }

  if (status === 401 || msg === 'Invalid email or password') {
    return 'Email hoặc mật khẩu không đúng.';
  }

  if (
    status === 400 &&
    msg.includes('This account does not support password login')
  ) {
    return 'Tài khoản này không đăng nhập bằng mật khẩu. Hãy đăng nhập bằng Google.';
  }

  return msg || 'Đăng nhập thất bại. Vui lòng thử lại.';
}

function mapGoogleLoginError(error) {
  const code = error?.code || '';

  if (code === 'auth/popup-closed-by-user') {
    return 'Bạn đã đóng cửa sổ đăng nhập Google.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Yêu cầu đăng nhập Google đã bị hủy.';
  }

  const parsed = parseApiError(error);
  const msg = (parsed.message || '').trim();

  if (msg === 'Google account mismatch') {
    return 'Tài khoản Google không khớp với tài khoản đã liên kết.';
  }

  return msg || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
}

function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  function redirectAfterLogin(data) {
    if (isAdminUser(data.user)) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }

  function validate() {
    const next = { email: '', password: '' };

    if (!email.trim()) {
      next.email = 'Vui lòng nhập email';
    } else if (!isValidEmail(email)) {
      next.email = 'Email không hợp lệ';
    }

    if (!password) {
      next.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(next);
    return !next.email && !next.password;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    setApiError('');
    setLoading(true);

    try {
      const body = await authService.login({
        email: email.trim(),
        password,
      });

      const data = getApiData(body);

      setAuth(data);
      redirectAfterLogin(data);
    } catch (e) {
      setApiError(mapLoginApiError(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setApiError('');
    setGoogleLoading(true);

    try {
      const { idToken } = await signInWithGoogle();

      const body = await authService.googleLogin({ idToken });
      const data = getApiData(body);

      setAuth(data);
      redirectAfterLogin(data);
    } catch (e) {
      setApiError(mapGoogleLoginError(e));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[520px]">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="px-7 pb-3 pt-7 text-center">
          <CardTitle className="text-2xl font-black text-(--text-primary)">
            Đăng nhập
          </CardTitle>

          <CardDescription className="mt-2 text-sm text-(--muted-text)">
            Chào mừng bạn quay lại EventHub.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-7 pb-7">
          {apiError && (
            <p
              className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500"
              role="alert"
            >
              {apiError}
            </p>
          )}

          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <Label
                htmlFor="login-email"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Email
              </Label>

              <Input
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                id="login-email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@vidu.com"
                type="email"
                value={email}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary) placeholder:text-(--muted-text)"
              />

              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-(--text-primary)"
                >
                  Mật khẩu
                </Label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-(--primary-color)"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Input
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                id="login-password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              className="h-[52px] w-full rounded-2xl bg-(--primary-color) font-bold text-white hover:bg-(--primary-color)"
              disabled={loading || googleLoading}
              type="submit"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang đăng nhập…
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-(--border-color)" />
            <span className="text-xs text-(--muted-text)">hoặc</span>
            <Separator className="flex-1 bg-(--border-color)" />
          </div>

          <GoogleAuthButton
            label={googleLoading ? 'Đang đăng nhập…' : 'Tiếp tục với Google'}
            loading={googleLoading}
            disabled={loading}
            onClick={handleGoogleLogin}
          />

          <p className="text-center text-sm text-(--muted-text)">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-(--primary-color)">
              Đăng ký ngay
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
