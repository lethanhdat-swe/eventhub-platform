import { useEffect, useState } from 'react';
import EventItem from '@/components/EventItem/EventItem';
import { saveEventService } from '@/lib/services/saveEvent';
import SavedEventsHero from './components/SavedEventsHero/SavedEventsHero';

function SavedEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      const data = await saveEventService.list();
      setEvents(data ?? []);
    };

    fetchSavedEvents();
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6">
      <SavedEventsHero />

      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          sm:gap-5
        "
      >
        {events.map((item) => (
          <div key={item.id} className="min-w-0">
            <EventItem event={item.event} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedEvents;
