import { useEffect, useRef, useState } from 'react';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const token = params.get('token') ?? '';

  const [status, setStatus] = useState(() => (!token ? 'failed' : 'loading'));
  const [errorDetail, setErrorDetail] = useState('');
  const [verifiedAuthData, setVerifiedAuthData] = useState(null);
  const [countdown, setCountdown] = useState(3);

  const verifyRequestSeq = useRef(0);

  useEffect(() => {
    if (!token) return undefined;

    const storageKey = `eventhub_verify_email_${token}`;
    const currentStatus = sessionStorage.getItem(storageKey);

    if (currentStatus === 'pending' || currentStatus === 'success') {
      return undefined;
    }

    sessionStorage.setItem(storageKey, 'pending');

    const seq = ++verifyRequestSeq.current;

    (async () => {
      try {
        const body = await authService.verifyEmail({ token });

        if (seq !== verifyRequestSeq.current) return;

        const data = getApiData(body);

        setVerifiedAuthData(data);
        setStatus('success');
        sessionStorage.setItem(storageKey, 'success');
      } catch (e) {
        if (seq !== verifyRequestSeq.current) return;

        setErrorDetail(getErrorMessage(e));
        setStatus('failed');
        sessionStorage.removeItem(storageKey);
      }
    })();

    return undefined;
  }, [token]);

  useEffect(() => {
    if (status !== 'success' || !verifiedAuthData) return undefined;

    setCountdown(3);

    const dest = isAdminUser(verifiedAuthData.user) ? '/admin/dashboard' : '/';

    const intervalId = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);

          setAuth(verifiedAuthData);
          navigate(dest, { replace: true });

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [navigate, setAuth, status, verifiedAuthData]);

  function handleNavigateNow() {
    if (!verifiedAuthData) return;

    const dest = isAdminUser(verifiedAuthData.user) ? '/admin/dashboard' : '/';

    setAuth(verifiedAuthData);
    navigate(dest, { replace: true });
  }

  const isAdmin = isAdminUser(verifiedAuthData?.user);

  return (
    <div className="w-full max-w-[440px]">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="px-7 pb-4 pt-8 text-center">
          <div
            className={`
              mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl
              ${
                status === 'failed'
                  ? 'bg-red-500/10 text-red-500'
                  : status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-(--primary-color)/10 text-(--primary-color)'
              }
            `}
          >
            {status === 'loading' && (
              <Loader2 aria-hidden className="size-7 animate-spin" />
            )}

            {status === 'success' && (
              <CheckCircle2 aria-hidden className="size-8" />
            )}

            {status === 'failed' && (
              <AlertCircle aria-hidden className="size-8" />
            )}
          </div>

          <CardTitle className="text-2xl font-black text-(--text-primary)">
            {status === 'loading' && 'Đang xác thực'}
            {status === 'success' && 'Xác thực thành công'}
            {status === 'failed' && 'Xác thực thất bại'}
          </CardTitle>

          <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--muted-text)">
            {status === 'loading' &&
              'Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra liên kết xác thực của bạn.'}

            {status === 'success' &&
              'Email của bạn đã được xác thực. Tài khoản hiện đã sẵn sàng để sử dụng.'}

            {status === 'failed' &&
              (!token
                ? 'Không tìm thấy token trên đường dẫn. Hãy mở lại đúng liên kết trong email.'
                : errorDetail ||
                  'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại hoặc liên hệ hỗ trợ.')}
          </CardDescription>
        </CardHeader>

        {status === 'success' && (
          <CardContent className="px-7 pb-4">
            <div className="rounded-2xl border border-(--border-color) bg-(--soft-surface-color) px-4 py-3 text-center text-xs leading-relaxed text-(--muted-text)">
              {isAdmin
                ? `Tự chuyển tới bảng điều khiển sau ${countdown} giây.`
                : `Tự chuyển về trang chủ sau ${countdown} giây.`}
            </div>
          </CardContent>
        )}

        <CardFooter className="flex flex-col gap-3 border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
          {status === 'success' && (
            <Button
              type="button"
              onClick={handleNavigateNow}
              className="h-12 w-full rounded-2xl bg-(--primary-color) font-bold text-white hover:bg-(--primary-color)"
            >
              {isAdmin ? 'Vào bảng điều khiển ngay' : 'Về trang chủ ngay'}
            </Button>
          )}

          {status !== 'loading' && status !== 'success' && (
            <Link
              to="/login"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color)"
            >
              Đăng nhập
            </Link>
          )}

          {status === 'failed' && (
            <Link
              to="/register"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white transition-all duration-300 hover:bg-(--primary-color)"
            >
              Đăng ký lại
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default VerifyEmailPage;
