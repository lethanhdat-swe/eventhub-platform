import PublicSeatMap from '@/pages/(public)/Events/components/PublicSeatMap/PublicSeatMap';

import BookingPanel from './components/BookingPanel/BookingPanel';

function EventSeat({
  seats = [],
  selectedSeatIds = [],
  selectedSeats = [],
  isLoading = false,
  onToggleSeat,
  onRemoveSeat,
  onClearSeats,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-5">
      <div className="col-span-12 lg:col-span-8">
        {isLoading ? (
          <div className="rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 p-5">
            <p className="text-(--text-primary)/60">Loading seat map...</p>
          </div>
        ) : (
          <PublicSeatMap
            seats={seats}
            mode="booking"
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={onToggleSeat}
          />
        )}
      </div>
      <div className="col-span-12 lg:col-span-4">
        <BookingPanel
          selectedSeats={selectedSeats}
          onRemove={onRemoveSeat}
          onClear={onClearSeats}
        />
      </div>
    </div>
  );
}

export default EventSeat;
