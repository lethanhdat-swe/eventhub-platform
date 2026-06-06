// src/pages/(public)/NotFound/NotFound.jsx

import { ArrowLeft, Compass, Home, SearchX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-(--background-color) text-(--text-primary)">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -top-45 h-105 w-105 -translate-x-1/2 rounded-full bg-(--primary-color)/25 blur-[120px]" />
        <div className="absolute -bottom-55 -right-30 h-105 w-105 rounded-full bg-(--primary-color)/20 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_34%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.2))]" />
      </div>

      <section className="container relative z-10 flex items-center justify-center min-h-screen py-24">
        <div className="w-full max-w-4xl text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-3xl border border-(--primary-color)/25 bg-(--primary-color)/10 text-(--primary-color) shadow-[0_0_45px_rgba(124,58,237,0.25)]">
            <SearchX size={30} />
          </div>

          <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-(--primary-color)">
            Không tìm thấy trang
          </p>

          <h1 className="max-w-3xl mx-auto font-black leading-none tracking-tight text-7xl md:text-8xl lg:text-9xl">
            4<span className="text-(--primary-color)">0</span>4
          </h1>

          <h2 className="max-w-2xl mx-auto mt-6 text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Có vẻ bạn đã đi lạc khỏi sân khấu chính
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-(--muted-text) md:text-base">
            Trang bạn đang tìm có thể đã bị xóa, đổi đường dẫn hoặc tạm thời
            không còn khả dụng. Hãy quay lại trang chủ để tiếp tục khám phá các
            sự kiện nổi bật trên Beetic.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 mt-9 sm:flex-row">
            <Link
              to="/"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-(--primary-color) px-6 text-sm font-bold text-white shadow-[0_0_32px_rgba(124,58,237,0.45)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <Home size={17} />
              Về trang chủ
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-(--border-color) bg-(--soft-surface-color) px-6 text-sm font-bold text-(--text-primary) backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-(--primary-color)/35 hover:bg-(--primary-color)/10"
            >
              <ArrowLeft size={17} />
              Quay lại
            </button>
          </div>

          <div className="grid max-w-3xl gap-4 mx-auto mt-14 md:grid-cols-3">
            <Link
              to="/events"
              className="group rounded-3xl border border-(--border-color) bg-(--card-surface-color) p-5 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-(--primary-color)/35 hover:bg-(--card-hover-color)"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
                <Compass size={20} />
              </div>

              <h3 className="mb-2 text-base font-black">Khám phá sự kiện</h3>
              <p className="text-sm leading-6 text-(--muted-text)">
                Tìm concert, workshop, lễ hội và các trải nghiệm phù hợp với
                bạn.
              </p>
            </Link>

            <Link
              to="/blogs"
              className="group rounded-3xl border border-(--border-color) bg-(--card-surface-color) p-5 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-(--primary-color)/35 hover:bg-(--card-hover-color)"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
                <SearchX size={20} />
              </div>

              <h3 className="mb-2 text-base font-black">Đọc bài viết</h3>
              <p className="text-sm leading-6 text-(--muted-text)">
                Cập nhật tin tức, kinh nghiệm và gợi ý tham gia sự kiện.
              </p>
            </Link>

            <Link
              to="/contact"
              className="group rounded-3xl border border-(--border-color) bg-(--card-surface-color) p-5 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-(--primary-color)/35 hover:bg-(--card-hover-color)"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
                <Home size={20} />
              </div>

              <h3 className="mb-2 text-base font-black">Liên hệ hỗ trợ</h3>
              <p className="text-sm leading-6 text-(--muted-text)">
                Gửi yêu cầu nếu bạn nghĩ đây là lỗi hoặc cần hỗ trợ thêm.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
