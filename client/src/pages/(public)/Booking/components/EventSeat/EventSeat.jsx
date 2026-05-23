import PublicSeatMap from '@/pages/(public)/Events/components/PublicSeatMap/PublicSeatMap';

import BookingPanel from "./components/BookingPanel/BookingPanel";

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
            <div className="col-span-12 lg:col-span-8 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-5 lg:p-6">
                {isLoading ? (
                    <p className="text-(--text-primary)/60">Loading seat map...</p>
                ) : (
                    <PublicSeatMap
                        seats={seats}
                        mode="booking"
                        selectedSeatIds={selectedSeatIds}
                        onToggleSeat={onToggleSeat}
                    />
                )}
            </div>
            <div className="col-span-12 lg:col-span-4 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-5 lg:p-6">
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