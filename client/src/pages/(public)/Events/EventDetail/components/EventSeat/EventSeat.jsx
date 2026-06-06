import { useMemo } from 'react';
import { Armchair } from 'lucide-react';

import PublicLoadingState from '@/components/PublicLoadingState/PublicLoadingState';
import PublicStatePanel from '@/components/PublicStatePanel/PublicStatePanel';

import PublicSeatMap from '../../../components/PublicSeatMap/PublicSeatMap';

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
      name: item.ticketType?.name ?? 'Vé',
      color: item.ticketType?.color ?? '#8b5cf6',
      price: item.ticketType?.price ?? 0,
    },
  };
}

const ENDED_SEAT_HELPER_TEXT =
  'Sơ đồ ghế chỉ dùng để tham khảo vì sự kiện đã kết thúc.';

function EventSeat({
  eventSeats = [],
  isLoading = false,
  error = null,
  isEnded = false,
  onRetry,
}) {
  const eventSeatItems = useMemo(
    () => eventSeats.map(mapEventSeat).filter((item) => item.id),
    [eventSeats]
  );

  return (
    <section className="mt-6 sm:mt-8 border-t border-(--border-color) pt-6 sm:pt-8">
      <div className="flex items-end justify-between gap-3 mb-4 sm:mb-5 sm:gap-4">
        <div>
          <p className="mb-1.5 sm:mb-2 flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-(--primary-color)">
            <Armchair size={13} className="sm:hidden" />
            <Armchair size={15} className="hidden sm:block" />
            Sơ đồ chỗ ngồi
          </p>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-(--text-primary)">
            {isEnded ? 'Sơ đồ chỗ ngồi' : 'Chọn vị trí của bạn'}
          </h2>
        </div>

        <span className="hidden rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-(--muted-text) sm:inline-flex">
          Xem trước
        </span>
      </div>

      {isLoading ? (
        <PublicLoadingState
          label="Đang tải sơ đồ chỗ ngồi..."
          minHeight="min-h-40"
        />
      ) : error ? (
        <PublicStatePanel
          variant="error"
          title="Không thể tải sơ đồ ghế"
          description={error}
          onRetry={onRetry}
        />
      ) : eventSeatItems.length === 0 ? (
        <PublicStatePanel
          title="Chưa có sơ đồ ghế"
          description="Sự kiện này chưa được cấu hình sơ đồ chỗ ngồi."
        />
      ) : (
        <PublicSeatMap
          seats={eventSeatItems}
          mode="preview"
          helperText={isEnded ? ENDED_SEAT_HELPER_TEXT : undefined}
        />
      )}
    </section>
  );
}

export default EventSeat;