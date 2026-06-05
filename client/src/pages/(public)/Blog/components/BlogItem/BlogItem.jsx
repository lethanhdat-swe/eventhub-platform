import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { ArrowRight, CalendarDays } from 'lucide-react';
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
  console.log(blog.author);

  return (
    <article className="mt-4 sm:mt-6">
      <div
        onClick={handleNavigate}
        className="
          group grid cursor-pointer grid-cols-12 gap-4 sm:gap-6
          rounded-2xl sm:rounded-[28px] border border-(--border-color)
          bg-(--card-surface-color) p-3 sm:p-4
          shadow-[0_22px_70px_rgba(0,0,0,0.22)]
          backdrop-blur-xl
          transition-all duration-500
          hover:-translate-y-1 hover:border-(--primary-color)/60
          hover:bg-(--card-hover-color)
          hover:shadow-[0_28px_90px_rgba(124,58,237,0.16)]
        "
      >
        {/* Thumbnail */}
        <div className="col-span-12 overflow-hidden rounded-xl sm:rounded-[24px] lg:col-span-5">
          <div className="relative h-50 sm:h-60 lg:h-full overflow-hidden rounded-xl sm:rounded-[24px]">
            <img
              src={resolvePublicAssetUrl(blog.thumbnailUrl)}
              alt={blog.title}
              className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />

            <span
              className="
                absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full
                border border-white/15 bg-black/35 px-3 py-1.5 sm:px-3.5 sm:py-2
                text-[10px] sm:text-xs font-black text-white
                backdrop-blur-xl
              "
            >
              {blog.category || 'Chưa phân loại'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center col-span-12 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4 sm:gap-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-(--primary-color)">
              Bài viết
            </span>

            <span className="h-1 w-1 rounded-full bg-(--muted-text)" />

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-(--muted-text)">
              <CalendarDays size={13} className="sm:hidden" />
              <CalendarDays size={16} className="hidden sm:block" />
              <span>{blog.date}</span>
            </div>
          </div>

          <h2
            className="
              mb-3 sm:mb-4 line-clamp-2
              text-lg sm:text-2xl md:text-3xl
              font-black leading-tight
              tracking-[-0.03em] sm:tracking-[-0.035em] text-(--text-primary)
              transition-colors duration-300
              group-hover:text-(--primary-color)
            "
          >
            {blog.title}
          </h2>

          <p className="hidden sm:block line-clamp-3 max-w-3xl text-sm sm:text-base font-medium leading-7 sm:leading-8 text-(--muted-text)">
            {blog.excerpt}
          </p>

          <div className="mt-4 sm:mt-8 flex items-center justify-between border-t border-(--border-color) pt-3 sm:pt-5">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-(--muted-text)">
                Tác giả
              </p>

              <p className="mt-0.5 sm:mt-1 truncate text-xs sm:text-sm font-bold text-(--text-primary)">
                {blog.author?.fullName || 'EventHub Editorial'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleButtonClick}
              className="
                inline-flex items-center gap-1.5 sm:gap-2 rounded-full
                border border-(--border-color)
                bg-(--soft-surface-color) px-4 sm:px-5 py-2.5 sm:py-3
                text-xs sm:text-sm font-black text-(--text-primary)
                transition-all duration-300
                hover:border-(--primary-color)/60
                hover:bg-(--primary-color)
                hover:text-white
                active:scale-95
              "
            >
              Xem chi tiết
              <ArrowRight
                size={14}
                className="transition-transform duration-300 sm:hidden group-hover:translate-x-1"
              />
              <ArrowRight
                size={16}
                className="hidden transition-transform duration-300 sm:block group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogItem;
