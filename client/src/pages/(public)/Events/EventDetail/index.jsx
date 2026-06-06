import EventHero from './components/EventHero/EventHero';
import EventInfoBar from './components/EventInfoBar/EventInfoBar';
import EventAbout from './components/EventAbout/EventAbout.jsx';
import EventOrganizer from './components/EventOrganizer/EventOrganizer';
import EventTickets from './components/EventTickets/EventTickets';
import EventInformation from './components/EventInformation/EventInformation';
import EventBooking from './components/EventBooking/EventBooking';
import EventComment from './components/EventComment/EventComment';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { eventService, ticketTypeService } from '@/lib/services/admin';
import { commentService } from '@/lib/services/comment';
import useEventSeatSocket from '@/hooks/useEventSeatSocket';
import EventSeat from './components/EventSeat/EventSeat';
import EventRelated from './components/EventRelated/EventRelated';
import {
  canBookEvent,
  isEventEnded,
  isEventOngoing,
} from '@/utils/eventDate';
import { getErrorMessage } from '@/lib/http/apiError';
import PublicLoadingState from '@/components/PublicLoadingState/PublicLoadingState';
import PublicStatePanel from '@/components/PublicStatePanel/PublicStatePanel';

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
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [eventError, setEventError] = useState(null);
  const [isSeatsLoading, setIsSeatsLoading] = useState(false);
  const [seatsError, setSeatsError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

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

  const refetchSeats = useCallback(async () => {
    if (!event?.id) return;

    setIsSeatsLoading(true);
    setSeatsError(null);

    try {
      const seatsPayload = await eventService.getSeats(event.id, {
        page: 1,
        limit: 500,
      });

      setEventSeats(
        Array.isArray(seatsPayload)
          ? seatsPayload
          : (seatsPayload.data ?? [])
      );
    } catch (error) {
      setSeatsError(getErrorMessage(error) || 'Không thể tải sơ đồ ghế');
    } finally {
      setIsSeatsLoading(false);
    }
  }, [event?.id]);

  useEventSeatSocket(event?.id, refetchSeats);

  useEffect(() => {
    if (!slug) return undefined;

    let ignore = false;

    async function fetchEvent() {
      setIsEventLoading(true);
      setEventError(null);
      setSeatsError(null);
      setEvent(null);

      try {
        const data = await eventService.getBySlug(slug);
        if (ignore) return;

        setEvent(data);
        setIsSeatsLoading(true);

        try {
          const [ticketTypes, commentsData, eventRelated, seatsPayload] =
            await Promise.all([
              ticketTypeService.list({ page: 1, limit: 100 }),
              commentService.list(data.id, { page: 1, limit: 100 }),
              eventService.eventRelated(data.id),
              eventService.getSeats(data.id, { page: 1, limit: 500 }),
            ]);

          if (ignore) return;

          setTickets(ticketTypes.data ?? []);
          setComments(commentsData ?? []);
          setRelatedEvents(eventRelated ?? []);
          setEventSeats(
            Array.isArray(seatsPayload)
              ? seatsPayload
              : (seatsPayload.data ?? [])
          );
        } catch (secondaryError) {
          if (!ignore) {
            setSeatsError(
              getErrorMessage(secondaryError) || 'Không thể tải sơ đồ ghế'
            );
          }
        } finally {
          if (!ignore) {
            setIsSeatsLoading(false);
          }
        }
      } catch (error) {
        if (!ignore) {
          setEventError(getErrorMessage(error) || 'Không thể tải sự kiện');
        }
      } finally {
        if (!ignore) {
          setIsEventLoading(false);
        }
      }
    }

    void fetchEvent();

    return () => {
      ignore = true;
    };
  }, [slug, reloadToken]);

  if (isEventLoading) {
    return (
      <main className="min-h-screen bg-(--background-color) pt-(--header-height) text-(--text-primary)">
        <PublicLoadingState label="Đang tải sự kiện..." />
      </main>
    );
  }

  if (eventError || !event) {
    return (
      <main className="min-h-screen bg-(--background-color) pt-(--header-height) text-(--text-primary)">
        <div className="container mx-auto max-w-2xl px-5 py-16">
          <PublicStatePanel
            variant="error"
            title="Không thể tải sự kiện"
            description={eventError || 'Sự kiện không tồn tại hoặc đã bị gỡ.'}
            onRetry={() => setReloadToken((token) => token + 1)}
          />
          <div className="mt-4 text-center">
            <Link
              to="/events"
              className="text-sm font-semibold text-(--primary-color) hover:underline"
            >
              Quay lại danh sách sự kiện
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isEnded = isEventEnded(event);
  const isOngoing = isEventOngoing(event);
  const canBook = canBookEvent(event);

  return (
    <main className="min-h-screen overflow-hidden bg-(--background-color) pt-(--header-height) text-(--text-primary)">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-(--primary-color)/10 blur-[120px]" />
        <div className="absolute right-0 top-80 h-90 w-90 rounded-full bg-(--primary-color)/5 blur-[100px]" />
      </div>

      <div className="container relative z-10 w-full pt-8 pb-16">
        <div className="grid grid-cols-12 gap-6 lg:items-start">
          <section className="order-1 col-span-12 space-y-5 lg:col-span-8">
            <EventHero
              event={event}
              isEnded={isEnded}
              isOngoing={isOngoing}
            />
            {isEnded ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-200/90">
                Sự kiện này đã kết thúc. Bạn không thể đặt vé mới.
              </div>
            ) : isOngoing ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-200/90">
                Sự kiện đang diễn ra. Bạn không thể đặt vé mới.
              </div>
            ) : null}
            <EventInfoBar event={event} />
            <EventAbout event={event} />
          </section>

          <aside className="order-2 col-span-12 lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <EventOrganizer event={event} />
              <EventBooking
                eventId={event.id}
                isEnded={isEnded}
                isOngoing={isOngoing}
              />
              <EventTickets tickets={tickets} canBook={canBook} />
              <EventInformation event={event} />
            </div>
          </aside>

          <section className="order-3 col-span-12 space-y-5 lg:col-span-8">
            <EventSeat
              eventSeats={eventSeats}
              isLoading={isSeatsLoading}
              error={seatsError}
              canBook={canBook}
              isOngoing={isOngoing}
              onRetry={refetchSeats}
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
