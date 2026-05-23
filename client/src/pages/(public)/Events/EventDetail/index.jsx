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
import { getErrorMessage } from '@/lib/http/apiError';

function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [comments, setComments] = useState([]);
  const [eventSeats, setEventSeats] = useState([]);
  const [isSeatsLoading, setIsSeatsLoading] = useState(false);
  const [seatsError, setSeatsError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsSeatsLoading(true);
      setSeatsError(null);

      try {
        const [data, payload, commentsData] = await Promise.all([
          eventService.getById(id),
          ticketTypeService.list({ page: 1, limit: 100 }),
          commentService.list(id),
        ]);

        setEvent(data);
        setTickets(payload.data ?? []);
        setComments(commentsData ?? []);

        if (Array.isArray(data?.eventSeats) || Array.isArray(data?.seats)) {
          setEventSeats(data.eventSeats ?? data.seats ?? []);
          return;
        }

        try {
          const seatsPayload = await eventService.getSeats(id, {
            page: 1,
            limit: 500,
          });
          setEventSeats(seatsPayload.data ?? []);
        } catch (error) {
          setEventSeats([]);
          setSeatsError(getErrorMessage(error));
        }
      } finally {
        setIsSeatsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (!event) return <div>Loading...</div>;
  return (
    <div className="pt-(--header-height) mx-auto mb-10 w-full max-w-[1320px] px-5 lg:px-8">
      <div className="grid grid-cols-12 gap-6 mt-8">
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
            eventId={id}
            comments={comments}
            setComments={setComments}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 xl:max-w-[360px] xl:justify-self-end">
          <EventOrganizer event={event} />
          <EventBooking eventId={event.id} />
          <EventTickets tickets={tickets} />
          <EventInformation event={event} />
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
