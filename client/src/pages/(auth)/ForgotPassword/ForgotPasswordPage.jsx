import { useState } from 'react';

import { Link } from 'react-router-dom';

import { Loader2, MailCheck } from 'lucide-react';

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
import { parseApiError } from '@/lib/http/apiError';
import { authService } from '@/lib/services/auth';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mapForgotPasswordError(error) {
  const { message } = parseApiError(error);
  const msg = (message || '').trim();

  if (msg === 'Email not found') {
    return 'Không tìm thấy email trong hệ thống.';
  }

  return msg || 'Không gửi được liên kết. Vui lòng thử lại.';
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    setApiError('');

    if (!email.trim()) {
      setFieldError('Vui lòng nhập email');
      return;
    }

    if (!isValidEmail(email)) {
      setFieldError('Email không hợp lệ');
      return;
    }

    setFieldError('');
    setLoading(true);

    try {
      await authService.forgotPassword({ email: email.trim() });
      setSent(true);
    } catch (e) {
      setApiError(mapForgotPasswordError(e));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-[420px]">
        <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <CardHeader className="px-7 pb-5 pt-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
              <MailCheck aria-hidden className="size-8" />
            </div>

            <CardTitle className="text-2xl font-black text-(--text-primary)">
              Kiểm tra email
            </CardTitle>

            <CardDescription className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-(--muted-text)">
              Nếu địa chỉ{' '}
              <strong className="font-semibold text-(--text-primary)">
                {email}
              </strong>{' '}
              tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật
              khẩu cho bạn.
            </CardDescription>
          </CardHeader>

          <CardFooter className="border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color)"
            >
              Quay lại đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px]">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="px-7 pb-4 pt-8 text-center">
          <CardTitle className="text-2xl font-black text-(--text-primary)">
            Quên mật khẩu
          </CardTitle>

          <CardDescription className="mt-2 text-sm leading-relaxed text-(--muted-text)">
            Nhập email tài khoản của bạn, chúng tôi sẽ gửi liên kết đặt lại mật
            khẩu.
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
                htmlFor="forgot-email"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Email
              </Label>

              <Input
                aria-invalid={Boolean(fieldError)}
                autoComplete="email"
                id="forgot-email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@vidu.com"
                type="email"
                value={email}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary) placeholder:text-(--muted-text)"
              />

              {fieldError && (
                <p className="text-xs text-red-500">{fieldError}</p>
              )}
            </div>

            <Button
              className="h-[52px] w-full rounded-2xl bg-(--primary-color) font-bold text-white hover:bg-(--primary-color)"
              disabled={loading}
              size="lg"
              type="submit"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang xử lý…
                </>
              ) : (
                'Gửi liên kết'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-(--muted-text)">
            Đã nhớ mật khẩu?{' '}
            <Link to="/login" className="font-bold text-(--primary-color)">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
