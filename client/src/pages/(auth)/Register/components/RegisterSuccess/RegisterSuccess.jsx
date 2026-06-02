import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function RegisterSuccess() {
  return (
    <div className="w-full max-w-105">
      <Card className="overflow-hidden rounded-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
            <CheckCircle2 className="size-8" />
          </div>

          <CardTitle>Kiểm tra hộp thư</CardTitle>

          <CardDescription>
            Chúng tôi đã gửi email xác thực tài khoản.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-3">
          <Link to="/login">Đến trang đăng nhập</Link>

          <Link to="/">Về trang chủ</Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterSuccess;