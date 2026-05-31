import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
import { signInWithGoogle } from '@/lib/firebase/googleAuth';
import { parseApiError } from '@/lib/http/apiError';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { authService } from '@/lib/services/auth';
import { useAuthStore } from '@/stores/authStore';
import GoogleAuthButton from '../components/GoogleAuthButton/GoogleAuthButton';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeMessage(message) {
  return String(message || '')
    .trim()
    .toLowerCase();
}

function mapRegisterError(error) {
  const parsed = parseApiError(error);
  const status = parsed.status;
  const rawMessage = parsed.message || '';
  const msg = normalizeMessage(rawMessage);

  if (status === 400 || status === 409) {
    if (
      msg.includes('email already exists') ||
      msg.includes('email already used') ||
      msg.includes('email is already taken') ||
      msg.includes('email exists')
    ) {
      return 'Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.';
    }

    if (msg.includes('phone number already exists')) {
      return 'Số điện thoại đã được sử dụng. Vui lòng dùng số điện thoại khác.';
    }

    if (msg.includes('email') && msg.includes('required')) {
      return 'Vui lòng nhập email.';
    }

    if (
      (msg.includes('full name') ||
        msg.includes('fullname') ||
        msg.includes('name')) &&
      msg.includes('required')
    ) {
      return 'Vui lòng nhập họ và tên.';
    }

    if (
      (msg.includes('phone') || msg.includes('phone number')) &&
      msg.includes('required')
    ) {
      return 'Vui lòng nhập số điện thoại.';
    }

    if (msg.includes('password') && msg.includes('required')) {
      return 'Vui lòng nhập mật khẩu.';
    }

    if (msg.includes('invalid email')) {
      return 'Email không hợp lệ.';
    }

    if (msg.includes('invalid phone') || msg.includes('invalid phone number')) {
      return 'Số điện thoại không hợp lệ.';
    }

    return 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.';
  }

  if (status >= 500) {
    return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
  }

  return rawMessage || 'Đăng ký thất bại. Vui lòng thử lại.';
}

function mapGoogleRegisterError(error) {
  const code = error?.code || '';

  if (code === 'auth/popup-closed-by-user') {
    return 'Bạn đã đóng cửa sổ đăng nhập Google.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Yêu cầu đăng nhập Google đã bị hủy.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Trình duyệt đã chặn cửa sổ đăng nhập Google. Vui lòng cho phép popup và thử lại.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Không thể kết nối tới Google. Vui lòng kiểm tra mạng và thử lại.';
  }

  const parsed = parseApiError(error);
  const status = parsed.status;
  const rawMessage = parsed.message || '';
  const msg = normalizeMessage(rawMessage);

  if (status === 400) {
    if (msg.includes('id token')) {
      return 'Phiên đăng nhập Google không hợp lệ. Vui lòng thử lại.';
    }

    return 'Đăng ký bằng Google không hợp lệ. Vui lòng thử lại.';
  }

  if (status === 401) {
    return 'Không thể xác thực tài khoản Google. Vui lòng thử lại.';
  }

  if (status === 403) {
    if (msg.includes('mismatch')) {
      return 'Tài khoản Google không khớp với tài khoản đã liên kết.';
    }

    if (msg.includes('blocked') || msg.includes('disabled')) {
      return 'Tài khoản của bạn đang bị khóa hoặc không còn hoạt động.';
    }

    return 'Bạn không có quyền đăng nhập bằng Google.';
  }

  if (status >= 500) {
    return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.';
  }

  if (msg.includes('google account mismatch')) {
    return 'Tài khoản Google không khớp với tài khoản đã liên kết.';
  }

  return rawMessage || 'Đăng ký bằng Google thất bại. Vui lòng thử lại.';
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

    if (!form.fullName.trim()) {
      next.fullName = 'Vui lòng nhập họ và tên.';
    } else if (form.fullName.trim().length < 2) {
      next.fullName = 'Họ và tên cần ít nhất 2 ký tự.';
    }

    if (!form.email.trim()) {
      next.email = 'Vui lòng nhập email.';
    } else if (!isValidEmail(form.email)) {
      next.email = 'Email không hợp lệ.';
    }

    if (!form.phoneNumber.trim()) {
      next.phoneNumber = 'Vui lòng nhập số điện thoại.';
    } else if (!/^[0-9]{10,15}$/.test(form.phoneNumber.trim())) {
      next.phoneNumber = 'Số điện thoại cần từ 10 đến 15 chữ số.';
    }

    if (!form.password) {
      next.password = 'Vui lòng nhập mật khẩu.';
    } else if (form.password.length < 6) {
      next.password = 'Mật khẩu cần ít nhất 6 ký tự.';
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      toast.error('Vui lòng kiểm tra lại thông tin đăng ký.');
      return false;
    }

    return true;
  }

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
      setApiError('');
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

      toast.success(
        'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.'
      );

      setSubmitted(true);
    } catch (e) {
      const message = mapRegisterError(e);

      setApiError(message);
      toast.error(message);
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

      toast.success('Đăng nhập Google thành công.');

      redirectAfterAuth(data);
    } catch (e) {
      const message = mapGoogleRegisterError(e);

      setApiError(message);
      toast.error(message);
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

          <GoogleAuthButton
            label={googleLoading ? 'Đang đăng ký…' : 'Tiếp tục với Google'}
            loading={googleLoading}
            disabled={loading}
            onClick={handleGoogleRegister}
          />

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
