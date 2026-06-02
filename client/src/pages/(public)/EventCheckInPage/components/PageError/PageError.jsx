import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function PageError({ message }) {
  return (
    <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
      <div className="p-8 mx-auto text-center text-red-200 border max-w-190 rounded-3xl border-red-500/20 bg-red-500/10">
        <div className="flex items-center justify-center mx-auto mb-5 text-red-300 size-16 rounded-2xl bg-red-400/10">
          <XCircle className="size-8" />
        </div>

        <p className="text-xl font-semibold">Không tải được thông tin vé</p>

        <p className="mt-2 text-sm leading-6 text-red-200/80">
          {message ?? 'Không tìm thấy đơn hàng.'}
        </p>

        <Link
          to="/profile"
          className="inline-flex px-4 py-2 mt-5 text-sm font-semibold transition border rounded-full border-red-300/20 hover:bg-red-300/10"
        >
          Quay lại hồ sơ
        </Link>
      </div>
    </div>
  );
}

export default PageError;
