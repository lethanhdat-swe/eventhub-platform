import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm({
  email,
  password,
  errors,
  loading,
  googleLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="space-y-2.5">
        <Label
          htmlFor="login-email"
          className="text-sm font-semibold text-(--text-primary)"
        >
          Email
        </Label>

        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ban@vidu.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          className="h-13 rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary) placeholder:text-(--muted-text)"
        />

        {errors.email && (
          <p className="text-xs text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="login-password"
            className="text-sm font-semibold text-(--text-primary)"
          >
            Mật khẩu
          </Label>

          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-(--primary-color)"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          aria-invalid={Boolean(errors.password)}
          className="h-13 rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
        />

        {errors.password && (
          <p className="text-xs text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || googleLoading}
        className="h-13 w-full rounded-2xl bg-(--primary-color) font-bold text-white hover:bg-(--primary-color)"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          'Đăng nhập'
        )}
      </Button>
    </form>
  );
}