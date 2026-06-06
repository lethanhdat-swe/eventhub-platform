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
import { Separator } from '@/components/ui/separator';
import GoogleAuthButton from '@/pages/(auth)/components/GoogleAuthButton/GoogleAuthButton';

function RegisterForm({
    form,
    errors,
    apiError,
    loading,
    googleLoading,
    onChange,
    onSubmit,
    onGoogleRegister,
}) {
    return (
        <div className="w-full max-w-[520px]">
            <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                <CardHeader className="px-5 pt-8 pb-4 text-center sm:px-8">
                    <CardTitle className="text-2xl font-black text-(--text-primary)">
                        Tạo tài khoản
                    </CardTitle>

                    <CardDescription className="mt-2 text-sm text-(--muted-text)">
                        Bắt đầu đặt vé và theo dõi sự kiện yêu thích.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 px-5 pb-8 sm:px-8">
                    {apiError && (
                        <p
                            role="alert"
                            className="px-4 py-3 text-sm text-red-500 rounded-xl bg-red-500/10"
                        >
                            {apiError}
                        </p>
                    )}

                    <form noValidate onSubmit={onSubmit} className="space-y-4">
                        {/* Họ và tên */}
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="register-name"
                                className="text-sm font-semibold text-(--text-primary)"
                            >
                                Họ và tên
                            </Label>

                            <Input
                                id="register-name"
                                autoComplete="name"
                                value={form.fullName}
                                onChange={onChange('fullName')}
                                aria-invalid={Boolean(errors.fullName)}
                                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
                            />

                            {errors.fullName && (
                                <p className="text-xs text-red-500">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="register-email"
                                className="text-sm font-semibold text-(--text-primary)"
                            >
                                Email
                            </Label>

                            <Input
                                id="register-email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={onChange('email')}
                                aria-invalid={Boolean(errors.email)}
                                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
                            />

                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Số điện thoại */}
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="register-phone"
                                className="text-sm font-semibold text-(--text-primary)"
                            >
                                Số điện thoại
                            </Label>

                            <Input
                                id="register-phone"
                                autoComplete="tel"
                                inputMode="numeric"
                                value={form.phoneNumber}
                                onChange={onChange('phoneNumber')}
                                aria-invalid={Boolean(errors.phoneNumber)}
                                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
                            />

                            {errors.phoneNumber && (
                                <p className="text-xs text-red-500">
                                    {errors.phoneNumber}
                                </p>
                            )}
                        </div>

                        {/* Mật khẩu */}
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="register-password"
                                className="text-sm font-semibold text-(--text-primary)"
                            >
                                Mật khẩu
                            </Label>

                            <Input
                                id="register-password"
                                type="password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={onChange('password')}
                                aria-invalid={Boolean(errors.password)}
                                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
                            />

                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="register-confirm"
                                className="text-sm font-semibold text-(--text-primary)"
                            >
                                Xác nhận mật khẩu
                            </Label>

                            <Input
                                id="register-confirm"
                                type="password"
                                autoComplete="new-password"
                                value={form.confirmPassword}
                                onChange={onChange('confirmPassword')}
                                aria-invalid={Boolean(errors.confirmPassword)}
                                className="h-[52px] rounded-2xl border-(--border-color) bg-(--soft-surface-color) px-4 text-(--text-primary)"
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
                            disabled={loading || googleLoading}
                            className="h-[52px] w-full rounded-2xl bg-(--primary-color) font-bold text-white hover:bg-(--primary-color)"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </Button>
                    </form>

                    <div className="flex items-center gap-3">
                        <Separator className="flex-1 bg-(--border-color)" />
                        <span className="text-xs text-(--muted-text)">
                            hoặc
                        </span>
                        <Separator className="flex-1 bg-(--border-color)" />
                    </div>

                    <GoogleAuthButton
                        label={
                            googleLoading
                                ? 'Đang đăng ký...'
                                : 'Tiếp tục với Google'
                        }
                        loading={googleLoading}
                        disabled={loading}
                        onClick={onGoogleRegister}
                    />

                    <p className="text-center text-sm text-(--muted-text)">
                        Đã có tài khoản?{' '}
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

export default RegisterForm;
