import EvenItem from "@/components/EventItem/EventItem";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function EventRelated({events}) {
    return ( 
        <div className="mt-10">
            <div className="flex items-center justify-between">
                <h1 className="text-(--text-primary)">You May Also Like</h1>

                <div className="flex items-center gap-1">
                <Link to={'/events'} className="text-(--primary-color)">
                    View All Events
                </Link>
                <ArrowRight color="var(--primary-color)" />
                </div>
            </div>

           <div className="grid grid-cols-5 gap-5 mt-5">
            {events.slice(0, 5).map((event) => (
                <div key={event.id} className="col-span-1">
                <EvenItem event={event} />
                </div>
            ))}
            </div>
        </div>
     );
}

export default EventRelated;