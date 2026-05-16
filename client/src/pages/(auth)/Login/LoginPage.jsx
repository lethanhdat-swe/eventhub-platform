import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Globe, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { isAdminUser } from '@/lib/auth/authRole';
import { parseApiError } from '@/lib/http/apiError';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { authService } from '@/lib/services/auth';
import { useAuthStore } from '@/stores/authStore';

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
    return 'Tài khoản này không đăng nhập bằng mật khẩu (ví dụ đã đăng ký bằng Google).';
  }

  return msg || 'Đăng nhập thất bại. Vui lòng thử lại.';
}

function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  function validate() {
    const next = { email: '', password: '' };
    if (!email.trim()) next.email = 'Vui lòng nhập email';
    else if (!isValidEmail(email)) next.email = 'Email không hợp lệ';
    if (!password) next.password = 'Vui lòng nhập mật khẩu';
    setErrors(next);
    return !next.email && !next.password;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setApiError('');
    setLoading(true);

    try {
      const body = await authService.login({ email, password });
      const data = getApiData(body);
      setAuth(data);
      if (isAdminUser(data.user)) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (e) {
      setApiError(mapLoginApiError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md" size="default">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu để tiếp tục. Chưa có tài khoản?{' '}
          <Link
            className="text-primary font-medium underline-offset-4 hover:underline"
            to="/register"
          >
            Đăng ký
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiError ? (
          <p
            className="text-destructive bg-destructive/5 rounded-lg px-3 py-2 text-sm"
            role="alert"
          >
            {apiError}
          </p>
        ) : null}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              id="login-email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@vidu.com"
              type="email"
              value={email}
            />
            {errors.email ? (
              <p className="text-destructive text-xs">{errors.email}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="login-password">Mật khẩu</Label>
              <Link
                className="text-muted-foreground text-xs hover:text-foreground"
                to="/forgot-password"
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
            />
            {errors.password ? (
              <p className="text-destructive text-xs">{errors.password}</p>
            ) : null}
          </div>
          <Button className="w-full" disabled={loading} type="submit" size="lg">
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
          <Separator className="flex-1" />
          <span className="text-muted-foreground shrink-0 text-xs">hoặc</span>
          <Separator className="flex-1" />
        </div>

        <Button className="w-full" type="button" variant="outline" size="lg">
          <Globe aria-hidden className="size-4 opacity-70" />
          Đăng nhập Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t-0 px-6 pt-0">
        <p className="text-muted-foreground text-center text-sm">
          Sau này sẽ đăng nhập bằng Firebase/Google — hiện chỉ là nút UI.
        </p>
      </CardFooter>
    </Card>
  );
}

export default LoginPage;
