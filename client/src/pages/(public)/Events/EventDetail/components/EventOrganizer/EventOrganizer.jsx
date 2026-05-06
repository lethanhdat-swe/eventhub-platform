import { BadgeCheck, Phone } from "lucide-react";
import OrganizerAvatar from "./components/OrganizerAvatar/OrganizerAvatar";

function EventOrganizer({event}) {
    return ( 
        <div className="p-5 bg-(--surface-color) rounded-xl">
            <h1 className="text-(--text-primary)">Event Organizer</h1>

            <div className="flex items-start gap-5 mt-5">
                <OrganizerAvatar />

               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <p className="text-(--text-primary)">{event.organizer.name}</p>
                    <BadgeCheck fill="var(--primary-color)" color="white"/> 
                  </div>

                <p className="text-(--text-primary)/70">Leading event organizer bringing the best music experience to life</p>

                <div className="flex items-center gap-3">
                    <Phone fill="var(--primary-color)" color="white"/> 
                    <p className="text-(--text-primary)">{event.hotline}</p>
                </div>
               </div>
            </div>
        </div>
     );
}

export default EventOrganizer;