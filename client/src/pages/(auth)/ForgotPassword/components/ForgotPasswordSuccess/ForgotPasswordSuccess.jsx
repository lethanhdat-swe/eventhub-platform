import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ForgotPasswordSuccess({ email }) {
  return (
    <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <CardHeader className="pt-8 pb-5 text-center px-7">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
          <MailCheck className="size-8" />
        </div>

        <CardTitle className="text-2xl font-black text-(--text-primary)">
          Kiểm tra email
        </CardTitle>

        <CardDescription className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-(--muted-text)">
          Nếu địa chỉ{' '}
          <strong className="font-semibold text-(--text-primary)">
            {email}
          </strong>{' '}
          tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>

      <CardFooter className="border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
        <Link
          to="/login"
          className="flex h-12 w-full items-center justify-center rounded-2xl border border-(--border-color) bg-(--card-surface-color) text-sm font-bold text-(--text-primary) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color)"
        >
          Quay lại đăng nhập
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ForgotPasswordSuccess;