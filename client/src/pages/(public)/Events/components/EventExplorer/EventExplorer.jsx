import EventFilters from "./components/EventFilters/EventFilters";
import EventFilterBar from "./components/EventFilterBar/EventFilterBar";
import EventItem from "@/components/EventItem/EventItem";
import EventPagination from "@/components/Pagination/Pagination";

import { useState } from "react";

function EventExplorer({
  events,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const [value, onChange] = useState("Featured");

  return (
    <div className="container grid grid-cols-12 gap-5 p-10">
      <div className="col-span-3">
        <EventFilters />
      </div>

      <div className="col-span-9 bg-(--background-color)/70 border border-white/10 p-3 rounded-r-2xl">
        <EventFilterBar value={value} onChange={onChange} />

        <div className="grid grid-cols-3 gap-5 mt-5">
          {events.length > 0 ? (
            events.map((event) => (
              <EventItem
                key={event.id}
                event={event}
              />
            ))
          ) : (
            <p className="col-span-3 text-center text-(--text-primary)/60 py-10">
              No events found
            </p>
          )}
        </div>

        <EventPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default EventExplorer;