import { useEffect, useRef, useState } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

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
      <div className="w-full max-w-[440px]">
        <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <CardHeader className="px-7 pb-4 pt-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <AlertTriangle aria-hidden className="size-8" />
            </div>

            <CardTitle className="text-2xl font-black text-(--text-primary)">
              Thiếu liên kết
            </CardTitle>

            <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--muted-text)">
              Đường dẫn đặt lại mật khẩu không hợp lệ. Hãy dùng liên kết đầy đủ
              được gửi qua email.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col gap-3 border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
            <Link
              to="/forgot-password"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white transition-all duration-300 hover:bg-(--primary-color)"
            >
              Yêu cầu liên kết mới
            </Link>

            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color)"
            >
              Đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="w-full max-w-[440px]">
        <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <CardHeader className="px-7 pb-4 pt-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
              <Loader2 aria-hidden className="size-8 animate-spin" />
            </div>

            <CardTitle className="text-2xl font-black text-(--text-primary)">
              Đang kiểm tra
            </CardTitle>

            <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--muted-text)">
              Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra liên kết đặt
              lại mật khẩu của bạn.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (phase === 'invalid') {
    return (
      <div className="w-full max-w-[440px]">
        <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <CardHeader className="px-7 pb-4 pt-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <AlertTriangle aria-hidden className="size-8" />
            </div>

            <CardTitle className="text-2xl font-black text-(--text-primary)">
              Liên kết không hợp lệ
            </CardTitle>

            <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--muted-text)">
              {invalidDetail ||
                'Liên kết đặt lại mật khẩu đã hết hạn hoặc không còn hiệu lực.'}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col gap-3 border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
            <Link
              to="/forgot-password"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white transition-all duration-300 hover:bg-(--primary-color)"
            >
              Yêu cầu liên kết mới
            </Link>

            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color)"
            >
              Đăng nhập
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="w-full max-w-[440px]">
        <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <CardHeader className="px-7 pb-4 pt-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 aria-hidden className="size-8" />
            </div>

            <CardTitle className="text-2xl font-black text-(--text-primary)">
              Đổi mật khẩu thành công
            </CardTitle>

            <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--muted-text)">
              Bạn có thể đăng nhập lại bằng mật khẩu mới vừa tạo.
            </CardDescription>
          </CardHeader>

          <CardFooter className="border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white transition-all duration-300 hover:bg-(--primary-color)"
            >
              Đăng nhập với mật khẩu mới
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px]">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="px-7 pb-4 pt-8 text-center">
          <CardTitle className="text-2xl font-black text-(--text-primary)">
            Mật khẩu mới
          </CardTitle>

          <CardDescription className="mt-2 text-sm leading-relaxed text-(--muted-text)">
            Nhập mật khẩu mới cho tài khoản của bạn.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-7 pb-7">
          {submitError && (
            <p
              className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <Label
                htmlFor="reset-password"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Mật khẩu mới
              </Label>

              <Input
                aria-invalid={Boolean(errors.password)}
                autoComplete="new-password"
                id="reset-password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="reset-confirm"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Xác nhận mật khẩu
              </Label>

              <Input
                aria-invalid={Boolean(errors.confirmPassword)}
                autoComplete="new-password"
                id="reset-confirm"
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                value={confirmPassword}
                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
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
                  Đang lưu…
                </>
              ) : (
                'Cập nhật mật khẩu'
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

export default ResetPasswordPage;
