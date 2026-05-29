import { useEffect, useState } from "react";
import SavedEventCard from "./components/SavedEventCard/SavedEventCard";
import SavedEventsHero from "./components/SavedEventsHero/SavedEventsHero";
import { saveEventService } from "@/lib/services/saveEvent";

function SavedEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await saveEventService.list();
            setEvents(data ?? []);
        };
        fetch();
    }, []);

    return (  
        <div>
            <SavedEventsHero />
            {/* 1 col mobile, 2 col sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {events.map((item) => (
                    <SavedEventCard key={item.id} event={item.event} />
                ))}
            </div>
        </div>
    );
}

export default SavedEvents;