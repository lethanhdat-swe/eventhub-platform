import EventFilters from './components/EventFilters/EventFilters';
import EventFilterBar from './components/EventFilterBar/EventFilterBar';
import EventItem from '@/components/EventItem/EventItem';
import EventPagination from '@/components/Pagination/Pagination';

function EventExplorer({
  events,
  currentPage,
  totalPages,
  onPageChange,
  onApply,
  totalEvents,
  sort,
  onSortChange,
}) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <aside className="col-span-12 lg:col-span-3">
        <EventFilters onApply={onApply} />
      </aside>

      <section
        className="
          col-span-12 lg:col-span-9
          rounded-[28px] border border-[var(--border-color)]
          bg-[var(--card-surface-color)]
          p-4 shadow-[0_20px_70px_rgba(0,0,0,0.24)]
          backdrop-blur-xl
        "
      >
        <EventFilterBar
          value={sort}
          onChange={onSortChange}
          totalEvents={totalEvents}
        />

        <div className="mt-6 grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          {events.length > 0 ? (
            events.map((event) => <EventItem key={event.id} event={event} />)
          ) : (
            <div
              className="
                col-span-full flex min-h-[260px] items-center justify-center
                rounded-[24px] border border-dashed border-[var(--border-color)]
                bg-[var(--soft-surface-color)]
              "
            >
              <p className="text-center text-sm font-medium text-[var(--muted-text)]">
                Không tìm thấy sự kiện phù hợp.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <EventPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </section>
    </div>
  );
}

export default EventExplorer;
