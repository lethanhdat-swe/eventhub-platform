import { Link } from 'react-router-dom';
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

export default function ResetPasswordForm({
  password,
  confirmPassword,
  errors,
  loading,
  submitError,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) {
  return (
    <div className="w-full max-w-110">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="pt-8 pb-4 text-center px-7">
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
              role="alert"
              className="px-4 py-3 text-sm text-red-500 rounded-xl bg-red-500/10"
            >
              {submitError}
            </p>
          )}

          <form className="space-y-4" noValidate onSubmit={onSubmit}>
            <div className="space-y-2.5">
              <Label
                htmlFor="reset-password"
                className="text-sm font-semibold text-(--text-primary)"
              >
                Mật khẩu mới
              </Label>

              <Input
                id="reset-password"
                type="password"
                value={password}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="h-13 rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
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
                id="reset-confirm"
                type="password"
                value={confirmPassword}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                className="h-13 rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
              />

              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-13 w-full rounded-2xl bg-(--primary-color) font-bold text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Cập nhật mật khẩu'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-(--muted-text)">
            Đã nhớ mật khẩu?{' '}
            <Link
              to="/login"
              className="font-bold text-(--primary-color)"
            >
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}