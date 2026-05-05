import { ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { events } from '../../data';
import EventCard from './components/EventCard';

function TrendEvent() {
  return (
    <div className="container pt-7.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Flame color="#f97316" />
          <h1 className="text-(--text-primary)">Trending This Week</h1>
        </div>
        <div className="flex items-center gap-1">
          <Link to={'/events'} className="text-(--primary-color)">
            View All
          </Link>
          <ArrowRight color="var(--primary-color)" />
        </div>
      </div>

      <div className="flex gap-4 mt-5">
        {events.slice(0, 4).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default TrendEvent;
