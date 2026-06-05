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

function ForgotPasswordForm({
  email,
  loading,
  fieldError,
  apiError,
  onEmailChange,
  onSubmit,
}) {
  return (
    <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <CardHeader className="pt-8 pb-4 text-center px-7">
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
            className="px-4 py-3 text-sm text-red-500 rounded-xl bg-red-500/10"
            role="alert"
          >
            {apiError}
          </p>
        )}

        <form className="space-y-4" noValidate onSubmit={onSubmit}>
          <div className="space-y-2.5">
            <Label
              htmlFor="forgot-email"
              className="text-sm font-semibold text-(--text-primary)"
            >
              Email
            </Label>

            <Input
              id="forgot-email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="ban@vidu.com"
              aria-invalid={Boolean(fieldError)}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-13 rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary) placeholder:text-(--muted-text)"
            />

            {fieldError && (
              <p className="text-xs text-red-500">{fieldError}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="h-13 w-full rounded-2xl bg-(--primary-color) font-bold text-white hover:bg-(--primary-color)"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Đang xử lý...
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
  );
}

export default ForgotPasswordForm;