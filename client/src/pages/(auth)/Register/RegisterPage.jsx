import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { CheckCircle2, Loader2 } from 'lucide-react';

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
// import { signInWithGoogle } from '@/lib/firebase/googleAuth';
import { parseApiError } from '@/lib/http/apiError';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { authService } from '@/lib/services/auth';
import { useAuthStore } from '@/stores/authStore';
import GoogleAuthButton from '../components/GoogleAuthButton/GoogleAuthButton';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mapRegisterError(error) {
  const { message } = parseApiError(error);
  const msg = (message || '').trim();

  if (msg === 'Email already exists') {
    return 'Email đã được sử dụng. Hãy đăng nhập hoặc dùng email khác.';
  }

  return msg || 'Đăng ký thất bại. Vui lòng thử lại.';
}

function mapGoogleRegisterError(error) {
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

  return msg || 'Đăng ký bằng Google thất bại. Vui lòng thử lại.';
}

function RegisterPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  function redirectAfterAuth(data) {
    if (isAdminUser(data.user)) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }

  function validate() {
    const next = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = 'Họ tên cần ít nhất 2 ký tự';
    }

    if (!form.email.trim()) {
      next.email = 'Vui lòng nhập email';
    } else if (!isValidEmail(form.email)) {
      next.email = 'Email không hợp lệ';
    }

    if (!/^[0-9]{10,15}$/.test(form.phoneNumber)) {
      next.phoneNumber = 'Số điện thoại cần 10–15 chữ số';
    }

    if (form.password.length < 6) {
      next.password = 'Mật khẩu cần ít nhất 6 ký tự';
    }

    if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    setApiError('');
    setLoading(true);

    try {
      await authService.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
      });

      setSubmitted(true);
    } catch (e) {
      setApiError(mapRegisterError(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setApiError('');
    setGoogleLoading(true);

    try {
      const { idToken } = await signInWithGoogle();

      const body = await authService.googleLogin({ idToken });
      const data = getApiData(body);

      setAuth(data);
      redirectAfterAuth(data);
    } catch (e) {
      setApiError(mapGoogleRegisterError(e));
    } finally {
      setGoogleLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-[420px]">
        <Card className="overflow-hidden rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <CardHeader className="pt-8 pb-6 text-center px-7">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
              <CheckCircle2 aria-hidden className="size-8" />
            </div>

            <CardTitle className="text-2xl font-black text-(--text-primary)">
              Kiểm tra hộp thư
            </CardTitle>

            <CardDescription className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-(--muted-text)">
              Chúng tôi đã gửi liên kết xác thực tới email của bạn. Sau khi xác
              thực, bạn có thể đăng nhập bình thường.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col gap-3 border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white transition-all duration-300 hover:translate-y-[-1px] hover:bg-(--primary-color)"
            >
              Đến trang đăng nhập
            </Link>

            <Link
              to="/"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color)"
            >
              Về trang chủ
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px]">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="px-8 pt-8 pb-4 text-center">
          <CardTitle className="text-2xl font-black text-(--text-primary)">
            Tạo tài khoản
          </CardTitle>

          <CardDescription className="mt-2 text-sm text-(--muted-text)">
            Bắt đầu đặt vé và theo dõi sự kiện yêu thích.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-5">
          {apiError && (
            <p
              className="px-4 py-3 text-sm text-red-500 rounded-xl bg-red-500/10"
              role="alert"
            >
              {apiError}
            </p>
          )}

          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <Label
                htmlFor="register-name"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Họ và tên
              </Label>

              <Input
                aria-invalid={Boolean(errors.fullName)}
                autoComplete="name"
                id="register-name"
                onChange={handleChange('fullName')}
                value={form.fullName}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="register-email"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Email
              </Label>

              <Input
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                id="register-email"
                onChange={handleChange('email')}
                type="email"
                value={form.email}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="register-phone"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Số điện thoại
              </Label>

              <Input
                aria-invalid={Boolean(errors.phoneNumber)}
                autoComplete="tel"
                id="register-phone"
                inputMode="numeric"
                onChange={handleChange('phoneNumber')}
                placeholder="0987654321"
                value={form.phoneNumber}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.phoneNumber && (
                <p className="text-xs text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="register-password"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Mật khẩu
              </Label>

              <Input
                aria-invalid={Boolean(errors.password)}
                autoComplete="new-password"
                id="register-password"
                onChange={handleChange('password')}
                type="password"
                value={form.password}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="register-confirm"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Xác nhận mật khẩu
              </Label>

              <Input
                aria-invalid={Boolean(errors.confirmPassword)}
                autoComplete="new-password"
                id="register-confirm"
                onChange={handleChange('confirmPassword')}
                type="password"
                value={form.confirmPassword}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              className="h-[52px] w-full rounded-2xl bg-(--primary-color) font-bold text-white hover:bg-(--primary-color)"
              disabled={loading || googleLoading}
              size="lg"
              type="submit"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang gửi…
                </>
              ) : (
                'Đăng ký'
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-(--border-color)" />
            <span className="text-xs text-(--muted-text)">hoặc</span>
            <Separator className="flex-1 bg-(--border-color)" />
          </div>

          {/* <GoogleAuthButton
            label={googleLoading ? 'Đang đăng ký…' : 'Tiếp tục với Google'}
            loading={googleLoading}
            disabled={loading}
            onClick={handleGoogleRegister}
          /> */}

          <p className="text-center text-sm text-(--muted-text)">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-(--primary-color)">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
