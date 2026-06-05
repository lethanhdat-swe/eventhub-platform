import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function VerifyEmailActions({
  status,
  isAdmin,
  onNavigateNow,
}) {
  return (
    <>
      {status === 'success' && (
        <Button
          type="button"
          onClick={onNavigateNow}
          className="h-12 w-full rounded-2xl bg-(--primary-color) font-bold text-white"
        >
          {isAdmin
            ? 'Vào bảng điều khiển ngay'
            : 'Về trang chủ ngay'}
        </Button>
      )}

      {status === 'failed' && (
        <>
          <Link
            to="/register"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white"
          >
            Đăng ký lại
          </Link>

          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary)"
          >
            Đăng nhập
          </Link>
        </>
      )}
    </>
  );
}