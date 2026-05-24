import EventHero from './components/EventHero/EventHero';
import EventInfoBar from './components/EventInfoBar/EventInfoBar';
import EventAbout from './components/EventAbout/EventAbout.jsx';
import EventOrganizer from './components/EventOrganizer/EventOrganizer';
import EventTickets from './components/EventTickets/EventTickets';
import EventInformation from './components/EventInformation/EventInformation';
import EventBooking from './components/EventBooking/EventBooking';
import EventComment from './components/EventComment/EventComment';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { eventService, ticketTypeService } from '@/lib/services/admin';
import { commentService } from '@/lib/services/comment';
import EventSeat from './components/EventSeat/EventSeat';
import EventRelated from './components/EventRelated/EventRelated';

function EventDetail() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [comments, setComments] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [eventSeats, setEventSeats] = useState([]);
  const [isSeatsLoading, setIsSeatsLoading] = useState(false);
  const [seatsError, setSeatsError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsSeatsLoading(true);
      setSeatsError(null);

      try {
        const data = await eventService.getBySlug(slug);
        setEvent(data);

        const [ticketTypes, commentsData, eventRelated, seatsPayload] =
          await Promise.all([
            ticketTypeService.list({ page: 1, limit: 100 }),
            commentService.list(data.id, { page: 1, limit: 100 }),
            eventService.eventRelated(data.id),
            eventService.getSeats(data.id, { page: 1, limit: 500 }),
          ]);

        setTickets(ticketTypes.data ?? []);
        setComments(commentsData ?? []);
        setRelatedEvents(eventRelated ?? []);
        setEventSeats(
          Array.isArray(seatsPayload) ? seatsPayload : (seatsPayload.data ?? [])
        );
      } catch (error) {
        setSeatsError(error?.message || 'Failed to load event seats');
      } finally {
        setIsSeatsLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (!event) return <div>Loading...</div>;
  return (
    <div className="pt-(--header-height) mx-auto mb-10 w-full max-w-[1320px] px-5 lg:px-8">
      <div className="grid grid-cols-12 gap-8 mt-8">
        <div className="col-span-12 lg:col-span-8">
          <EventHero event={event} />
          <EventInfoBar event={event} />
          <EventAbout event={event} />

          <EventSeat
            eventSeats={eventSeats}
            isLoading={isSeatsLoading}
            error={seatsError}
          />

          <EventComment
            eventId={event.id}
            comments={comments}
            setComments={setComments}
          />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <EventOrganizer event={event} />
          <EventBooking eventId={event.id} />
          <EventTickets tickets={tickets} />
          <EventInformation event={event} />
        </div>
      </div>

      <EventRelated events={relatedEvents} />
    </div>
  );
}

export default EventDetail;
