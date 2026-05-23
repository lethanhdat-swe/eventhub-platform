import EventHero from "./components/EventHero/EventHero";
import EventInfoBar from "./components/EventInfoBar/EventInfoBar";
import EventAbout from "./components/EventAbout/EventAbout.jsx";
import EventOrganizer from "./components/EventOrganizer/EventOrganizer";
import EventTickets from "./components/EventTickets/EventTickets";
import EventInformation from "./components/EventInformation/EventInformation";
import EventRelated from "./components/EventRelated/EventRelated";
import EventBooking from "./components/EventBooking/EventBooking";
import EventComment from "./components/EventComment/EventComment";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { eventService, ticketTypeService } from "@/lib/services/admin";
import { commentService } from "@/lib/services/comment";


function EventDetail() {

    const { slug } = useParams();

    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [comments, setComments] = useState([]);
    const [relatedEvents, setRelatedEvents] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            
        const data = await eventService.getBySlug(slug);
        setEvent(data);

        const ticketTypes = await ticketTypeService.list({ page: 1, limit: 100 });
        setTickets(ticketTypes.data ?? []);

        const commentsData = await commentService.list(data.id, { page: 1, limit: 100 });
        setComments(commentsData?? []);

        const eventRelated = await eventService.eventRelated(data.id);
        setRelatedEvents(eventRelated?? []);
    };

        if (slug) {
            fetchEvent();
            }
    }, [slug]);

    if (!event) return <div>Loading...</div>;

  return (
        <div className="pt-(--header-height) px-10 mb-10">
        <div className="grid grid-cols-12 gap-8 mt-10">
            <div className="col-span-8">
                <EventHero event={event} />
                <EventInfoBar event={event} />
                <EventAbout event={event} />
                <EventComment
                    eventId={event.id}
                    comments={comments}
                    setComments={setComments}
                />
            </div>

            <div className="col-span-4">
               <EventOrganizer event={event} />
               <EventBooking />
               <EventTickets tickets={tickets} />
               <EventInformation event={event} />
            </div>
        </div>

        <EventRelated events={relatedEvents}/>
        </div>
  );
}

export default EventDetail;