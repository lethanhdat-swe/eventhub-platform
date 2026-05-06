import EventExplorer from './components/EventExplorer/EventExplorer';
import EventsTitle from './components/EventsTitle';

function Events() {
  return (
    <div className="pt-(--header-height)">
      <EventsTitle />
      <EventExplorer />
    </div>
  );
}

export default Events;
