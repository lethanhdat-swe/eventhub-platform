import EvenItem from '@/components/EventItem/EventItem';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function EventRelated({ events = [] }) {
  if (!events.length) return null;

  return (
    <section className="mt-16 border-t border-(--border-color) pt-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-(--primary-color)">
            <Sparkles size={15} />
            Gợi ý cho bạn
          </p>

          <h2 className="text-2xl font-black tracking-tight text-(--text-primary)">
            Có thể bạn cũng thích
          </h2>
        </div>

        <Link
          to="/events"
          className="group hidden items-center gap-2 rounded-full border border-(--border-color) bg-(--soft-surface-color) px-4 py-2 text-sm font-bold text-(--text-primary) transition-colors hover:border-(--primary-color)/50 hover:bg-(--primary-color)/10 sm:inline-flex"
        >
          Xem tất cả
          <ArrowRight
            size={16}
            className="text-(--primary-color) transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <EvenItem key={event.id} event={event} />
        ))}
      </div>

      <Link
        to="/events"
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-(--border-color) bg-(--soft-surface-color) px-4 py-3 text-sm font-bold text-(--text-primary) transition-colors hover:border-(--primary-color)/50 hover:bg-(--primary-color)/10 sm:hidden"
      >
        Xem tất cả sự kiện
        <ArrowRight size={16} className="text-(--primary-color)" />
      </Link>
    </section>
  );
}

export default EventRelated;
