import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/assets/icons";
import { Link } from "lucide-react";

function EventInformation({event}) {
    const dateStr = `${event.date.weekday}, ${event.date.day} ${event.date.month} ${event.date.year}`;
    return ( 
        <div className="p-5 bg-(--surface-color) rounded-xl mt-4">
            <h1 className="text-(--text-primary) text-xl">Event Information</h1>

            <div className="flex justify-between mt-5 text-(--text-primary)/70">
                <div className="flex flex-col gap-5 ">
                    <p>Date</p>
                    <p>Time</p>
                    <p>Location</p>
                    <p>Age Restriction</p>
                    <p>Genres</p>
                </div>

                <div className="flex flex-col gap-5 ">
                    <p>{dateStr}</p>
                    <p>{event.date.fullTime}</p>
                    <p>{event.location}</p>
                    <p>18+ Only</p>
                    <p>EDM, Electronic Dance</p>
                </div>
            </div>

            <div className="mt-10 border-t-2 border-(--text-primary)/30 p-4 flex gap-7">
                <h1 className="text-(--text-primary) text-[18px]">Share this event</h1>

               <div className="flex items-center gap-4 text-(--text-primary)">
                       <FacebookIcon />
                       <InstagramIcon />
                       <TwitterIcon />
                       <Link />
                     </div>
            </div>
        </div>
     );
}

export default EventInformation;