import PublicSeatMap from '@/pages/(public)/Events/components/PublicSeatMap/PublicSeatMap';

import BookingPanel from './components/BookingPanel/BookingPanel';

const ENDED_SEAT_HELPER_TEXT =
  'Sơ đồ ghế chỉ dùng để tham khảo vì sự kiện đã kết thúc.';

function EventSeat({
  seats = [],
  selectedSeatIds = [],
  selectedSeats = [],
  isLoading = false,
  isEnded = false,
  onToggleSeat,
  onRemoveSeat,
  onClearSeats,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-5">
      <div className={isEnded ? 'col-span-12' : 'col-span-12 lg:col-span-8'}>
        {isLoading ? (
          <div className="rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 p-5">
            <p className="text-(--text-primary)/60">Đang tải sơ đồ ghế...</p>
          </div>
        ) : (
          <PublicSeatMap
            seats={seats}
            mode={isEnded ? 'preview' : 'booking'}
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={onToggleSeat}
            helperText={isEnded ? ENDED_SEAT_HELPER_TEXT : undefined}
          />
        )}
      </div>
      {!isEnded ? (
        <div className="col-span-12 lg:col-span-4">
          <BookingPanel
            selectedSeats={selectedSeats}
            onRemove={onRemoveSeat}
            onClear={onClearSeats}
          />
        </div>
      ) : null}
    </div>
  );
}

export default EventSeat;
