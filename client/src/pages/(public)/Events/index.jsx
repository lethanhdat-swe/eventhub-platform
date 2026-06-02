import { useEffect, useState } from 'react';
import EventExplorer from './components/EventExplorer/EventExplorer';
import EventsTitle from './components/EventsTitle';
import { eventService } from '@/lib/services/admin';

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

  useEffect(() => {
    const fetchEvents = async () => {
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
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, [currentPage, filters]);

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
          <EventExplorer
            events={events}
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
