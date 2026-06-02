import { Link } from 'react-router-dom';

export default function ResetPasswordActions() {
  return (
    <>
      <Link
        to="/forgot-password"
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white transition-all duration-300"
      >
        Yêu cầu liên kết mới
      </Link>

      <Link
        to="/login"
        className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary)"
      >
        Đăng nhập
      </Link>
    </>
  );
}