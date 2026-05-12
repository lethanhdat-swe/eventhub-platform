import EventItem from "@/components/EventItem/EventItem";
import { events } from "@/pages/(public)/Events/data";
import { ArrowRight, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";

function EventsSection() {
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

            <div className="grid grid-cols-12 gap-5 mt-5">
                {events.map((event) => (
                     <div  key={event.id} className="col-span-3">
                        <EventItem event={event} />
                     </div>
                ))}

            </div>
        </div>
     );
}

export default EventsSection;