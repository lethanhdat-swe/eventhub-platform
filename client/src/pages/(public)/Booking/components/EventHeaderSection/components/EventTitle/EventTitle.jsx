import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function EventTitle({ event, isLoading }) {
  const title = isLoading ? 'Đang tải sự kiện...' : (event?.title ?? 'Sự kiện');
  const categoryName = event?.category?.name;

  return (
    <div className="space-y-5">
      <Link
        to="/events"
        className="
          group inline-flex w-fit items-center gap-2 rounded-full
          border border-(--text-primary)/10 bg-white/3
          px-3.5 py-2 text-sm font-medium text-(--text-primary)/65
          transition-all duration-300
          hover:border-(--primary-color)/35 hover:bg-(--primary-color)/10 hover:text-(--text-primary)
        "
      >
        <ArrowLeft
          size={17}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        Quay lại sự kiện
      </Link>

      <div className="space-y-3">
        {categoryName ? (
          <span
            className="
              inline-flex w-fit items-center rounded-full border
              px-3 py-1 text-xs font-black uppercase tracking-[0.12em]
            "
            style={{
              color: 'var(--primary-color)',
              backgroundColor:
                'color-mix(in srgb, var(--primary-color) 14%, transparent)',
              borderColor:
                'color-mix(in srgb, var(--primary-color) 35%, transparent)',
            }}
          >
            {categoryName}
          </span>
        ) : null}

        <h1 className="max-w-3xl line-clamp-2 break-words text-3xl font-black leading-tight tracking-[-0.035em] text-(--text-primary) md:text-[38px] lg:text-[42px]">
          {title}
        </h1>
      </div>
    </div>
  );
}

export default EventTitle;
