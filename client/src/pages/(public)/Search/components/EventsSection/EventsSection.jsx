import { useEffect, useState } from "react";
import EventItem from "@/components/EventItem/EventItem";
import { ArrowRight, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { searchService } from "@/lib/services/searchService";

function EventsSection({ keyword }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Transform API data to match EventItem component format
    const transformEventData = (apiEvent) => {
        const startDate = new Date(apiEvent.startDate);
        
        return {
            id: apiEvent.id,
            title: apiEvent.title,
            image: apiEvent.thumbnailUrl || '/default-event.jpg',
            location: apiEvent.location,
            slug: apiEvent.slug,
            tag: 'Featured',
            price: 0, // Default price since API doesn't return it
            date: {
                day: startDate.getDate(),
                month: startDate.toLocaleString('en-US', { month: 'short' }),
                year: startDate.getFullYear(),
                weekday: startDate.toLocaleString('en-US', { weekday: 'short' }),
                time: startDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }).split(' ')[0],
                period: startDate.getHours() >= 12 ? 'PM' : 'AM',
            },
            rating: 4.5, // Default rating
            reviewCount: 0, // Default review count
        };
    };

    useEffect(() => {
        if (!keyword || keyword.trim() === "") {
            setEvents([]);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await searchService.search(keyword);
                const transformedEvents = result.events.map(transformEventData);
                setEvents(transformedEvents);
            } catch (err) {
                console.error("Error searching events:", err);
                setError("Failed to search events. Please try again.");
                setEvents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
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
                <div className="mt-5 text-center text-(--text-secondary)">
                    <p>Loading events...</p>
                </div>
            )}

            {error && (
                <div className="mt-5 text-center text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && events.length === 0 && keyword && (
                <div className="mt-5 text-center text-(--text-secondary)">
                    <p>No events found for "{keyword}"</p>
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