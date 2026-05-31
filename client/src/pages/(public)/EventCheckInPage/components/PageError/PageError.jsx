import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function PageError({ message }) {
  return (
    <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
      <div className="mx-auto max-w-[760px] rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
          <XCircle className="size-8" />
        </div>

        <p className="text-xl font-semibold">Không tải được thông tin vé</p>

        <p className="mt-2 text-sm leading-6 text-red-200/80">
          {message ?? 'Không tìm thấy đơn hàng.'}
        </p>

        <Link
          to="/profile"
          className="mt-5 inline-flex rounded-full border border-red-300/20 px-4 py-2 text-sm font-semibold transition hover:bg-red-300/10"
        >
          Quay lại hồ sơ
        </Link>
      </div>
    </div>
  );
}

export default PageError;
