import { useEffect, useState } from "react";
import EventItem from "@/components/EventItem/EventItem";
import { ArrowRight, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { searchService } from "@/lib/services/search";

function EventsSection({ keyword }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
            setIsLoading(true)
            const fetchData = async () => {
                const res = await searchService.search(keyword);
                setEvents(res.events)
            };
            fetchData();
            setIsLoading(false)
    }, [keyword]);

    return ( 
        <div className="container mt-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TicketCheck color="var(--primary-color)"/>
                    <p className="text-(--text-primary) text-xl">Events</p> 
                </div>

               <div className="flex items-center gap-1">
                    <Link to={'/events'} className="text-(--primary-color)">
                        View All Events
                    </Link>
                    <ArrowRight color="var(--primary-color)" />
                </div>
            </div>

            {isLoading && (
                <div className="mt-5 text-center text-(--text-primary) text-xl">
                    <p>Loading events...</p>
                </div>
            )}
            {!isLoading && events.length === 0 && keyword && (
                <div className="mt-5 text-center text-(--text-primary) text-xl">
                    <p>No events found for &quot;{keyword}&quot;</p>
                </div>
            )}

            {events.length > 0 && (
                <div className="grid grid-cols-12 gap-5 mt-5">
                    {events.map((event) => (
                         <div  key={event.id} className="col-span-3">
                            <EventItem event={event} />
                         </div>
                    ))}
                </div>
            )}
        </div>
     );
}

export default EventsSection;