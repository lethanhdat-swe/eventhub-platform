import SavedEventCard from "./components/SavedEventCard/SavedEventCard";
import SavedEventsHero from "./components/SavedEventsHero/SavedEventsHero";
import { eventsaved } from "./data";

function SavedEvents() {
    return (  
        <div>
            <SavedEventsHero />
            {eventsaved.map((event) => (
                <SavedEventCard key={event.id} event={event} />
            ))}
        </div>
    );
}

export default SavedEvents;