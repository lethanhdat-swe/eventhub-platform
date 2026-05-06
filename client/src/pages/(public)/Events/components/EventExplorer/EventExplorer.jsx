import { useState } from 'react';
import { eventData } from '../../data';
import EventFilterBar from './components/EventFilterBar/EventFilterBar';
import EventFilters from './components/EventFilters/EventFilters';
import EvenItem from '@/components/EventItem/EventItem';
import Pagination from '@/components/Pagination/Pagination';

function EventExplorer() {
  const [value, onChange] = useState('Featured');

  const [currentPage, setCurrentPage] = useState(
    eventData.pagination.currentPage
  );
  const { itemsPerPage, totalPages } = eventData.pagination;
  const start = (currentPage - 1) * itemsPerPage;
  const currentEvents = eventData.events.slice(start, start + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="container grid grid-cols-12 p-10">
      <div className="col-span-3">
        <EventFilters />
      </div>

      <div className="col-span-9 bg-(--background-color)/70 border border-white/10 p-3 rounded-r-2xl ">
        <EventFilterBar value={value} onChange={onChange} />
        <div className="grid grid-cols-3 gap-5">
          {currentEvents.map((event) => (
            <EvenItem key={event.id} event={event} />
          ))}
        </div>  
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default EventExplorer;
