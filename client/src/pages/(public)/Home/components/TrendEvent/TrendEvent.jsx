import { ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from './components/EventCard/EventCard';

function TrendEvent({ trendingEvents }) {
  return (
    <section className="container pt-12">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Flame size={23} />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl">
              Trending This Week
            </h2>
            <p className="mt-1 text-sm text-(--text-primary)/50">
              Sự kiện đang được quan tâm nhiều nhất
            </p>
          </div>
        </div>

        <Link
          to="/events"
          className="group hidden items-center gap-2 rounded-full border border-(--primary-color)/25 bg-(--primary-color)/10 px-5 py-2.5 text-sm font-bold text-(--primary-color) transition hover:bg-(--primary-color) hover:text-white sm:flex"
        >
          Xem tất cả
          <ArrowRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {trendingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

export default TrendEvent;
