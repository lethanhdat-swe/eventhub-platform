import { useCallback, useEffect, useState } from 'react';
import EventExplorer from './components/EventExplorer/EventExplorer';
import EventsTitle from './components/EventsTitle';
import { eventService } from '@/lib/services/admin';
import { getErrorMessage } from '@/lib/http/apiError';
import PublicStatePanel from '@/components/PublicStatePanel/PublicStatePanel';

const INITIAL_FILTERS = {
  search: '',
  sort: '',
  fromDate: '',
  toDate: '',
  categoryIds: [],
};

function Events() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetchEvents = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await eventService.list({
          page: currentPage,
          limit: 9,
          status: 'PUBLISHED',
          ...filters,
        });

        setEvents(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalItems(response.meta?.totalItems || 0);
      } catch (err) {
        setEvents([]);
        setError(getErrorMessage(err) || 'Không thể tải danh sách sự kiện');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchEvents();
  }, [currentPage, filters, reloadToken]);

  const handleApply = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setFilters((prev) => ({ ...prev, sort: newSort }));
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-(--background-color) text-(--text-primary)">
      <EventsTitle totalEvents={totalItems} />

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.16),transparent_32%),radial-gradient(circle_at_top_left,rgba(168,85,247,0.1),transparent_28%)]" />

        <div className="container relative z-10 py-14">
          {error ? (
            <div className="mb-6">
              <PublicStatePanel
                variant="error"
                title="Không thể tải sự kiện"
                description={error}
                onRetry={refetchEvents}
              />
            </div>
          ) : null}

          <EventExplorer
            events={events}
            loading={isLoading}
            hasError={Boolean(error)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onApply={handleApply}
            totalEvents={totalItems}
            sort={filters.sort}
            onSortChange={handleSortChange}
          />
        </div>
      </section>
    </main>
  );
}

export default Events;
