import { useState } from 'react';

import { Link } from 'react-router-dom';

import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
import { parseApiError } from '@/lib/http/apiError';
import { authService } from '@/lib/services/auth';

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

function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      next.fullName = 'Họ tên cần ít nhất 2 ký tự';
    }
    if (!form.email.trim()) next.email = 'Vui lòng nhập email';
    else if (!isValidEmail(form.email)) next.email = 'Email không hợp lệ';
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

  if (submitted) {
    return (
      <Card className="w-full max-w-md" size="default">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 aria-hidden className="text-primary size-7" />
          </div>
          <CardTitle>Kiểm tra hộp thư</CardTitle>
          <CardDescription>
            Chúng tôi đã gửi liên kết xác thực tới email bạn vừa đăng ký. Sau khi bấm xác thực trong
            email, bạn có thể đăng nhập bình thường.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            className={cn(buttonVariants({ size: 'lg', variant: 'default' }), 'justify-center')}
            to="/login"
          >
            Đến trang đăng nhập
          </Link>
          <Link
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'justify-center')}
            to="/"
          >
            Về trang chủ
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md" size="default">
      <CardHeader>
        <CardTitle>Tạo tài khoản</CardTitle>
        <CardDescription>
          Điền thông tin bên dưới để đăng ký. Đã có tài khoản?{' '}
          <Link className="text-primary font-medium underline-offset-4 hover:underline" to="/login">
            Đăng nhập
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiError ? (
          <p
            className="text-destructive bg-destructive/5 mb-4 rounded-lg px-3 py-2 text-sm"
            role="alert"
          >
            {apiError}
          </p>
        ) : null}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="register-name">Họ và tên</Label>
            <Input
              aria-invalid={Boolean(errors.fullName)}
              autoComplete="name"
              id="register-name"
              onChange={handleChange('fullName')}
              value={form.fullName}
            />
            {errors.fullName ? (
              <p className="text-destructive text-xs">{errors.fullName}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              id="register-email"
              onChange={handleChange('email')}
              type="email"
              value={form.email}
            />
            {errors.email ? <p className="text-destructive text-xs">{errors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-phone">Số điện thoại</Label>
            <Input
              aria-invalid={Boolean(errors.phoneNumber)}
              autoComplete="tel"
              id="register-phone"
              inputMode="numeric"
              onChange={handleChange('phoneNumber')}
              placeholder="0987654321"
              value={form.phoneNumber}
            />
            {errors.phoneNumber ? (
              <p className="text-destructive text-xs">{errors.phoneNumber}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Mật khẩu</Label>
            <Input
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
              id="register-password"
              onChange={handleChange('password')}
              type="password"
              value={form.password}
            />
            {errors.password ? (
              <p className="text-destructive text-xs">{errors.password}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-confirm">Xác nhận mật khẩu</Label>
            <Input
              aria-invalid={Boolean(errors.confirmPassword)}
              autoComplete="new-password"
              id="register-confirm"
              onChange={handleChange('confirmPassword')}
              type="password"
              value={form.confirmPassword}
            />
            {errors.confirmPassword ? (
              <p className="text-destructive text-xs">{errors.confirmPassword}</p>
            ) : null}
          </div>
          <Button className="w-full" disabled={loading} size="lg" type="submit">
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
      </CardContent>
    </Card>
  );
}

export default RegisterPage;
