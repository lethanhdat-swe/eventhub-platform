import EventExplorer from './components/EventExplorer/EventExplorer';
import EventsTitle from './components/EventsTitle';

function Events() {
  return (
    <div className="pt-22.5">
      <EventsTitle />
      <EventExplorer />
    </div>
  );
}

export default Events;
