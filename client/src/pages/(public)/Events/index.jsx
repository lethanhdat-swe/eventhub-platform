import { useEffect, useState } from "react";
import EventExplorer from "./components/EventExplorer/EventExplorer";
import EventsTitle from "./components/EventsTitle";
import { eventService } from "@/lib/services/admin";

function Events() {
  const [events, setEvents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.list({
          page: currentPage,
          limit: 6,
          status: "PUBLISHED",
        });

        setEvents(response.data || []);

        setTotalPages(response.meta?.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, [currentPage]);

  return (
    <div className="pt-(--header-height)">
      <EventsTitle />

      <EventExplorer
        events={events}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Events;