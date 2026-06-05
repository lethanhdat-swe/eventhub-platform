import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getErrorMessage } from '@/lib/http/apiError';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { eventService } from '@/lib/services/admin';
import { authService } from '@/lib/services/auth/authService';
import { useAuthStore } from '@/stores/authStore';

import CustomerFormSection from './components/CustomerFormSection/CustomerFormSection';
import EventHeaderSection from './components/EventHeaderSection/EventHeaderSection';
import EventSeat from './components/EventSeat/EventSeat';
import OrderSummarySection from './components/OrderSummarySection/OrderSummarySection';
import { isEventEnded } from '@/utils/eventDate';

function mapEventSeat(item) {
  return {
    id: item.id,
    status: item.status,
    seat: {
      rowLabel: item.seat?.rowLabel ?? item.rowLabel,
      seatNumber: item.seat?.seatNumber ?? item.seatNumber,
    },
    ticketType: {
      id: item.ticketType?.id ?? item.ticketTypeId,
      name: item.ticketType?.name ?? 'Ticket',
      color: item.ticketType?.color ?? '#8b5cf6',
      price: item.ticketType?.price ?? 0,
    },
  };
}

function getCustomerForm(user) {
  return {
    name: user?.fullName ?? user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phoneNumber ?? user?.phone ?? '',
  };
}

function Booking() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (authUser) {
      setCustomerInfo(getCustomerForm(authUser));
    }

    let ignore = false;

    const fetchCurrentUser = async () => {
      try {
        const body = await authService.getMe();
        const user = getApiData(body);

        if (!ignore) {
          setCustomerInfo(getCustomerForm(user));
        }
      } catch {
        // Keep the locally stored auth user if the profile refresh fails.
      }
    };

    fetchCurrentUser();

    return () => {
      ignore = true;
    };
  }, [authUser, isAuthenticated]);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!eventId) {
        setError('Missing event information. Please choose an event first.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [eventData, seatsPayload] = await Promise.all([
          eventService.getById(eventId),
          eventService.getSeats(eventId, { page: 1, limit: 500 }),
        ]);

        setEvent(eventData);
        setSeats((seatsPayload.data ?? []).map(mapEventSeat));
        setSelectedSeatIds([]);
      } catch (err) {
        setError(getErrorMessage(err));
        setEvent(null);
        setSeats([]);
        setSelectedSeatIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [eventId]);

  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedSeatIds.includes(seat.id)),
    [seats, selectedSeatIds]
  );

  const isEnded = isEventEnded(event);

  const handleToggleSeat = (seat) => {
    if (isEnded) return;

    setSelectedSeatIds((currentIds) => {
      if (currentIds.includes(seat.id)) {
        return currentIds.filter((id) => id !== seat.id);
      }

      return [...currentIds, seat.id];
    });
  };

  const handleRemoveSeat = (seatId) => {
    setSelectedSeatIds((currentIds) =>
      currentIds.filter((id) => id !== seatId)
    );
  };

  return (
    <div className="pt-(--header-height) mx-auto mb-10 w-full container space-y-4 ">
      {error ? (
        <div className="rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 p-6 text-(--text-primary)/70">
          {error}
        </div>
      ) : null}

      {isEnded ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-200/90">
          Sự kiện này đã kết thúc. Bạn không thể đặt vé mới.
        </div>
      ) : null}

      <EventHeaderSection event={event} isLoading={isLoading} />
      <EventSeat
        seats={seats}
        selectedSeatIds={selectedSeatIds}
        selectedSeats={selectedSeats}
        isLoading={isLoading}
        isEnded={isEnded}
        onToggleSeat={handleToggleSeat}
        onRemoveSeat={handleRemoveSeat}
        onClearSeats={() => setSelectedSeatIds([])}
      />
      <CustomerFormSection value={customerInfo} onChange={setCustomerInfo} />
      <OrderSummarySection
        event={event}
        selectedSeats={selectedSeats}
        selectedSeatIds={selectedSeatIds}
        customerInfo={customerInfo}
      />
    </div>
  );
}

export default Booking;
