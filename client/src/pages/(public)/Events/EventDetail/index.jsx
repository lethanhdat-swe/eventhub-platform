import { useParams } from "react-router-dom";
import { events } from "../data";
import EventHero from "./components/EventHero/EventHero";
import EventInfoBar from "./components/EventInfoBar/EventInfoBar";
import EventAbout from "./components/EventAbout/EventAbout.jsx";
import EventOrganizer from "./components/EventOrganizer/EventOrganizer";
import EventTickets from "./components/EventTickets/EventTickets";
import EventInformation from "./components/EventInformation/EventInformation";
import EventRelated from "./components/EventRelated/EventRelated";
import EventBooking from "./components/EventBooking/EventBooking";
import EventComment from "./components/EventComment/EventComment";


function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => e.id === Number(id));

  if (!event) return <div>Event not found</div>;

  const relatedEvents = events.filter((e) => e.id !== Number(id));

  return (
        <div className="pt-(--header-height) px-10 mb-10">
        <div className="grid grid-cols-12 gap-8 mt-10">
            <div className="col-span-8">
                <EventHero event={event} />
                <EventInfoBar event={event} />
                <EventAbout event={event} />
                <EventComment />
            </div>

            <div className="col-span-4">
               <EventOrganizer event={event} />
                <EventBooking />
               <EventTickets event={event} />
               <EventInformation event={event} />
            </div>
        </div>

        <EventRelated events={relatedEvents}/>
        </div>
  );
}

export default EventDetail;