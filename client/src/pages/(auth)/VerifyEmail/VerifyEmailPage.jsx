import { useEffect, useRef, useState } from 'react';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

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
import { isAdminUser } from '@/lib/auth/authRole';
import { getErrorMessage } from '@/lib/http/apiError';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { authService } from '@/lib/services/auth';
import { useAuthStore } from '@/stores/authStore';

function VerifyEmailPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState(() => (!token ? 'failed' : 'loading'));
  const [errorDetail, setErrorDetail] = useState('');
  const autoNavTimerRef = useRef(null);
  /** Tránh StrictMode / remount làm hai request verify và lời gọi sau ghi đè thành công */
  const verifyRequestSeq = useRef(0);

  useEffect(() => {
    if (!token) return undefined;

    const seq = ++verifyRequestSeq.current;

    (async () => {
      try {
        const body = await authService.verifyEmail({ token });
        if (seq !== verifyRequestSeq.current) return;
        setAuth(getApiData(body));
        setStatus('success');
      } catch (e) {
        if (seq !== verifyRequestSeq.current) return;
        setErrorDetail(getErrorMessage(e));
        setStatus('failed');
      }
    })();

    return undefined;
  }, [token]);

  useEffect(() => {
    if (status !== 'success') return undefined;

    const dest = isAdminUser(user) ? '/admin/dashboard' : '/';

    autoNavTimerRef.current = window.setTimeout(() => {
      navigate(dest, { replace: true });
    }, 3000);

    return () => {
      if (autoNavTimerRef.current !== null) {
        window.clearTimeout(autoNavTimerRef.current);
      }
    };
  }, [navigate, status, user]);

  return (
    <Card className="w-full max-w-md" size="default">
      <CardHeader>
        <CardTitle>Xác thực email</CardTitle>
        <CardDescription>Kích hoạt tài khoản qua liên kết trong email.</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'loading' ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 aria-hidden className="text-muted-foreground size-10 animate-spin" />
            <p className="text-muted-foreground text-sm">Đang xác minh liên kết của bạn…</p>
          </div>
        ) : null}

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 aria-hidden className="size-11 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-2">
              <p className="text-sm leading-relaxed font-medium">
                Địa chỉ email đã được xác thực. Phiên đăng nhập của bạn đã được lưu.
              </p>
              <p className="text-muted-foreground text-xs">
                {isAdminUser(user)
                  ? 'Tự chuyển tới bảng điều khiển sau 3 giây, hoặc bấm nút bên dưới.'
                  : 'Tự chuyển về trang chủ sau 3 giây, hoặc bấm nút bên dưới.'}
              </p>
            </div>
          </div>
        ) : null}

        {status === 'failed' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <AlertCircle aria-hidden className="size-11 text-destructive" />
            <p className="text-muted-foreground text-sm">
              {!token
                ? 'Không tìm thấy token trên đường dẫn. Hãy mở lại đúng liên kết trong email (có ?token=...).'
                : errorDetail ||
                  'Token không hợp lệ hoặc đã hết hạn. Yêu cầu đăng ký lại hoặc liên hệ hỗ trợ.'}
            </p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center gap-2">
        {status === 'success' ? (
          <Button
            size="lg"
            type="button"
            onClick={() =>
              navigate(isAdminUser(user) ? '/admin/dashboard' : '/', {
                replace: true,
              })
            }
          >
            {isAdminUser(user) ? 'Vào bảng điều khiển' : 'Về trang chủ'}
          </Button>
        ) : null}
        <Link
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'justify-center')}
          to="/login"
        >
          Đăng nhập
        </Link>
        <Link className={cn(buttonVariants({ size: 'lg' }), 'justify-center')} to="/register">
          Đăng ký lại
        </Link>
      </CardFooter>
    </Card>
  );
}

export default VerifyEmailPage;
