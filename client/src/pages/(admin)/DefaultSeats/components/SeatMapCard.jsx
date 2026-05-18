import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SeatMapLegend from '@/pages/(admin)/DefaultSeats/components/SeatMapLegend';
import SeatMapSeat from '@/pages/(admin)/DefaultSeats/components/SeatMapSeat';
import {
  groupSeatsByRow,
  STAGE_LABEL,
} from '@/pages/(admin)/DefaultSeats/seatMapUtils';

function SeatMapStage() {
  return (
    <div className="mb-10 flex w-full items-center justify-center gap-3 px-4">
      <span className="hidden h-px max-w-20 flex-1 bg-zinc-200 sm:block" aria-hidden />
      <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        {STAGE_LABEL}
      </p>
      <span className="hidden h-px max-w-20 flex-1 bg-zinc-200 sm:block" aria-hidden />
    </div>
  );
}

function SeatMapSkeleton() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-5 py-12">
      <Skeleton className="h-4 w-32 rounded" />
      {[1, 2, 3].map((row) => (
        <div key={row} className="flex justify-center gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="size-11 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

function SeatMapCard({
  seats,
  selectedSeat,
  isLoading,
  error,
  onSeatClick,
  onRetry,
}) {
  const rows = groupSeatsByRow(seats);
  const isEmpty = !isLoading && seats.length === 0;

  return (
    <Card className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50 py-0 shadow-none ring-0">
      <CardContent className="overflow-x-auto p-0">
        {isLoading ? (
          <SeatMapSkeleton />
        ) : error && seats.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 px-8 py-16 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Thử lại
            </Button>
          </div>
        ) : isEmpty ? (
          <p className="flex min-h-[360px] items-center justify-center px-8 py-16 text-center text-sm text-muted-foreground">
            Chưa có ghế nào. Hãy thêm ghế hoặc thêm hàng ghế đầu tiên.
          </p>
        ) : (
          <div className="flex min-h-[420px] min-w-0 flex-col justify-center bg-white px-6 py-10 md:px-12 md:py-14">
            <SeatMapStage />
            <div className="flex flex-col gap-5">
              {rows.map(({ rowLabel, seats: rowSeats }) => (
                <div
                  key={rowLabel}
                  className="flex justify-center gap-3 px-2"
                >
                  {rowSeats.map((seat) => (
                    <SeatMapSeat
                      key={seat.id}
                      seat={seat}
                      selected={selectedSeat?.id === seat.id}
                      onClick={onSeatClick}
                    />
                  ))}
                </div>
              ))}
            </div>
            <SeatMapLegend seats={seats} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SeatMapCard;
