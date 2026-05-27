import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { ArrowRight, CalendarDays, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BlogItem({ blog }) {
  const navigate = useNavigate();
  const detailPath = `/blog/${blog.slug ?? blog.id}`;

  const handleNavigate = () => {
    navigate(detailPath);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    navigate(detailPath);
  };

  return (
    <article className="container mt-6">
      <div
        onClick={handleNavigate}
        className="
          group grid cursor-pointer grid-cols-12 gap-6
          rounded-[28px] border border-[var(--border-color)]
          bg-[var(--card-surface-color)] p-4
          shadow-[0_22px_70px_rgba(0,0,0,0.22)]
          backdrop-blur-xl
          transition-all duration-500
          hover:-translate-y-1 hover:border-[var(--primary-color)]/60
          hover:bg-[var(--card-hover-color)]
          hover:shadow-[0_28px_90px_rgba(124,58,237,0.16)]
        "
      >
        <div className="col-span-12 overflow-hidden rounded-[24px] lg:col-span-5">
          <div className="relative h-[260px] overflow-hidden rounded-[24px]">
            <img
              src={resolvePublicAssetUrl(blog.thumbnailUrl)}
              alt={blog.title}
              className="
                h-full w-full object-cover
                transition-transform duration-700 ease-out
                group-hover:scale-105
              "
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />

            <span
              className="
                absolute left-4 top-4 rounded-full
                border border-white/15 bg-black/35 px-3.5 py-2
                text-xs font-black text-white
                backdrop-blur-xl
              "
            >
              {blog.category || 'Chưa phân loại'}
            </span>
          </div>
        </div>

        <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-[var(--primary-color)]">
              Bài viết
            </span>

            <span className="h-1 w-1 rounded-full bg-[var(--muted-text)]" />

            <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-text)]">
              <CalendarDays size={16} />
              <span>{blog.date}</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-text)]">
              <Eye size={16} />
              <span>{blog.views || 0} lượt xem</span>
            </div>
          </div>

          <h2
            className="
              mb-4 line-clamp-2 text-2xl font-black leading-tight
              tracking-[-0.035em] text-[var(--text-primary)]
              transition-colors duration-300
              group-hover:text-white
              md:text-3xl
            "
          >
            {blog.title}
          </h2>

          <p className="line-clamp-3 max-w-3xl text-base font-medium leading-8 text-[var(--muted-text)]">
            {blog.excerpt}
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border-color)] pt-5">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--muted-text)]">
                Tác giả
              </p>

              <p className="mt-1 truncate text-sm font-bold text-[var(--text-primary)]">
                {blog.author?.email || 'EventHub Editorial'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className="
                inline-flex items-center gap-2 rounded-full
                border border-[var(--border-color)]
                bg-[var(--soft-surface-color)] px-5 py-3
                text-sm font-black text-[var(--text-primary)]
                transition-all duration-300
                hover:border-[var(--primary-color)]/60
                hover:bg-[var(--primary-color)]
                hover:text-white
                active:scale-95
              "
            >
              Đọc tiếp
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogItem;
