import EventHero from './components/EventHero/EventHero';
import EventInfoBar from './components/EventInfoBar/EventInfoBar';
import EventAbout from './components/EventAbout/EventAbout.jsx';
import EventOrganizer from './components/EventOrganizer/EventOrganizer';
import EventTickets from './components/EventTickets/EventTickets';
import EventInformation from './components/EventInformation/EventInformation';
import EventBooking from './components/EventBooking/EventBooking';
import EventComment from './components/EventComment/EventComment';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { eventService, ticketTypeService } from '@/lib/services/admin';
import { commentService } from '@/lib/services/comment';
import EventSeat from './components/EventSeat/EventSeat';
import EventRelated from './components/EventRelated/EventRelated';

const appendReplyToTree = (items = [], parentId, newReply) => {
  return items.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        replies: [...(item.replies ?? []), newReply],
      };
    }

    return {
      ...item,
      replies: appendReplyToTree(item.replies ?? [], parentId, newReply),
    };
  });
};

const updateCommentInTree = (items = [], commentId, updatedComment) => {
  return items.map((item) => {
    if (item.id === commentId) {
      return {
        ...item,
        ...updatedComment,
        replies: Array.isArray(updatedComment.replies)
          ? updatedComment.replies
          : (item.replies ?? []),
      };
    }

    return {
      ...item,
      replies: updateCommentInTree(
        item.replies ?? [],
        commentId,
        updatedComment
      ),
    };
  });
};

const removeCommentFromTree = (items = [], commentId) => {
  return items
    .filter((item) => item.id !== commentId)
    .map((item) => ({
      ...item,
      replies: removeCommentFromTree(item.replies ?? [], commentId),
    }));
};

function EventDetail() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [comments, setComments] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [eventSeats, setEventSeats] = useState([]);
  const [isSeatsLoading, setIsSeatsLoading] = useState(false);
  const [seatsError, setSeatsError] = useState(null);

  const addRootComment = useCallback((newComment) => {
    setComments((prev) => [newComment, ...(Array.isArray(prev) ? prev : [])]);
  }, []);

  const addReply = useCallback((parentId, newReply) => {
    setComments((prev) =>
      Array.isArray(prev) ? appendReplyToTree(prev, parentId, newReply) : prev
    );
  }, []);

  const updateComment = useCallback((commentId, updatedComment) => {
    setComments((prev) =>
      Array.isArray(prev)
        ? updateCommentInTree(prev, commentId, updatedComment)
        : prev
    );
  }, []);

  const removeComment = useCallback((commentId) => {
    setComments((prev) =>
      Array.isArray(prev) ? removeCommentFromTree(prev, commentId) : prev
    );
  }, []);

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

  if (!event) {
    return (
      <main className="min-h-screen bg-(--background-color) pt-(--header-height) text-(--text-primary)">
        <div className="mx-auto flex min-h-[60vh] max-w-330 items-center justify-center px-5">
          <div className="rounded-2xl border border-(--border-color) bg-(--card-surface-color) px-6 py-4 text-sm text-(--muted-text)">
            Loading event...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-(--background-color) pt-(--header-height) text-(--text-primary)">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-(--primary-color)/10 blur-[120px]" />
        <div className="absolute right-0 top-80 h-90 w-90 rounded-full bg-(--primary-color)/5 blur-[100px]" />
      </div>

      <div className="container relative z-10 w-full pt-8 pb-16">
        <div className="grid grid-cols-12 gap-6 lg:items-start">
          {/* Main top content */}
          <section className="order-1 col-span-12 space-y-5 lg:col-span-8">
            <EventHero event={event} />
            <EventInfoBar event={event} />
            <EventAbout event={event} />
          </section>

          {/* Booking sidebar - mobile/tablet sẽ lên trước seat + comment */}
          <aside className="order-2 col-span-12 lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <EventOrganizer event={event} />
              <EventBooking eventId={event.id} />
              <EventTickets tickets={tickets} />
              <EventInformation event={event} />
            </div>
          </aside>

          {/* Main bottom content */}
          <section className="order-3 col-span-12 space-y-5 lg:col-span-8">
            <EventSeat
              eventSeats={eventSeats}
              isLoading={isSeatsLoading}
              error={seatsError}
            />

            <EventComment
              eventId={event.id}
              comments={comments}
              onAddComment={addRootComment}
              onAddReply={addReply}
              onUpdateComment={updateComment}
              onRemoveComment={removeComment}
            />
          </section>
        </div>

        <div className="mt-14">
          <EventRelated events={relatedEvents} />
        </div>
      </div>
    </main>
  );
}

export default EventDetail;
