import { useEffect, useRef, useState } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import { AlertTriangle, Loader2 } from 'lucide-react';

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
import { getErrorMessage } from '@/lib/http/apiError';
import { authService } from '@/lib/services/auth';

function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';

  const [phase, setPhase] = useState(() => (token ? 'loading' : 'missing'));
  const [invalidDetail, setInvalidDetail] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const verifySeq = useRef(0);

  useEffect(() => {
    if (!token) return undefined;

    const seq = ++verifySeq.current;

    (async () => {
      try {
        await authService.verifyResetToken({ token });
        if (seq !== verifySeq.current) return;
        setPhase('form');
      } catch (e) {
        if (seq !== verifySeq.current) return;
        setInvalidDetail(getErrorMessage(e));
        setPhase('invalid');
      }
    })();

    return undefined;
  }, [token]);

  function validateForm() {
    const next = { password: '', confirmPassword: '' };
    if (password.length < 6) {
      next.password = 'Mật khẩu cần ít nhất 6 ký tự';
    }
    if (password !== confirmPassword) {
      next.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(next);
    return !next.password && !next.confirmPassword;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      await authService.resetPassword({ token, password });
      setPhase('success');
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'missing') {
    return (
      <Card className="w-full max-w-md" size="default">
        <CardHeader>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
          <CardDescription>Thiếu token trong đường dẫn.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
            <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p>Hãy dùng liên kết đầy đủ được gửi qua email. Định dạng:</p>
              <code className="bg-muted mt-2 block truncate rounded px-2 py-1 text-xs">
                /reset-password?token=…
              </code>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2 sm:justify-between">
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'justify-center')}
            to="/forgot-password"
          >
            Yêu cầu liên kết mới
          </Link>
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'justify-center')}
            to="/login"
          >
            Đăng nhập
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (phase === 'loading') {
    return (
      <Card className="w-full max-w-md" size="default">
        <CardHeader>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
          <CardDescription>Đang kiểm tra liên kết đặt lại mật khẩu…</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="size-10 animate-spin text-muted-foreground" aria-hidden />
        </CardContent>
      </Card>
    );
  }

  if (phase === 'invalid') {
    return (
      <Card className="w-full max-w-md" size="default">
        <CardHeader>
          <CardTitle>Liên kết không hợp lệ</CardTitle>
          <CardDescription>Token hết hạn hoặc không còn hiệu lực.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3 text-sm">
            {invalidDetail ||
              'Liên kết đặt lại mật khẩu chỉ dùng được trong thời gian ngắn. Yêu cầu email mới nếu cần.'}
          </p>
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <Link className={cn(buttonVariants({ variant: 'default' }), 'justify-center')} to="/forgot-password">
            Quên mật khẩu lại
          </Link>
          <Link
            className={cn(buttonVariants({ variant: 'outline' }), 'justify-center')}
            to="/login"
          >
            Đăng nhập
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (phase === 'success') {
    return (
      <Card className="w-full max-w-md" size="default">
        <CardHeader>
          <CardTitle>Đặt lại mật khẩu thành công</CardTitle>
          <CardDescription>Bạn có thể đăng nhập với mật khẩu mới.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'justify-center')}
            to="/login"
          >
            Đăng nhập với mật khẩu mới
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md" size="default">
      <CardHeader>
        <CardTitle>Mật khẩu mới</CardTitle>
        <CardDescription>Nhập mật khẩu mới cho tài khoản của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        {submitError ? (
          <p
            className="text-destructive bg-destructive/5 mb-4 rounded-lg px-3 py-2 text-sm"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="reset-password">Mật khẩu mới</Label>
            <Input
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
              id="reset-password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
            />
            {errors.password ? (
              <p className="text-destructive text-xs">{errors.password}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reset-confirm">Xác nhận mật khẩu</Label>
            <Input
              aria-invalid={Boolean(errors.confirmPassword)}
              autoComplete="new-password"
              id="reset-confirm"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              value={confirmPassword}
            />
            {errors.confirmPassword ? (
              <p className="text-destructive text-xs">{errors.confirmPassword}</p>
            ) : null}
          </div>
          <Button className="w-full" disabled={loading} size="lg" type="submit">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Đang lưu…
              </>
            ) : (
              'Cập nhật mật khẩu'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link className="text-muted-foreground text-sm hover:text-foreground" to="/login">
          ← Quay đăng nhập
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ResetPasswordPage;
