import { useState } from 'react';

import { Link } from 'react-router-dom';

import { Loader2, MailCheck } from 'lucide-react';

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
      <Card className="w-full max-w-md" size="default">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <MailCheck aria-hidden className="text-primary size-7" />
          </div>
          <CardTitle>Kiểm tra email của bạn</CardTitle>
          <CardDescription>
            Nếu địa chỉ <strong className="text-foreground">{email}</strong> tồn tại trong hệ thống,
            chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Mở hộp thư và làm theo liên kết (hết hạn sau
            1 giờ).
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center border-t-0 px-6 pt-0">
          <Link
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'justify-center')}
            to="/login"
          >
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md" size="default">
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email để nhận liên kết đặt lại mật khẩu. Trang đổi mật khẩu có định dạng{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">?token=...</code>.
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
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              aria-invalid={Boolean(fieldError)}
              autoComplete="email"
              id="forgot-email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
            />
            {fieldError ? <p className="text-destructive text-xs">{fieldError}</p> : null}
          </div>
          <Button className="w-full" disabled={loading} size="lg" type="submit">
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
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <Link className="text-muted-foreground text-sm hover:text-foreground" to="/login">
          ← Đăng nhập
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ForgotPasswordPage;
