import { useEffect, useState } from "react";
import EventExplorer from "./components/EventExplorer/EventExplorer";
import EventsTitle from "./components/EventsTitle";
import { eventService } from "@/lib/services/admin";

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
          limit: 6,
          status: "PUBLISHED",
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
    <div className="pt-(--header-height)">
      <EventsTitle />

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
  );
}

export default Events;