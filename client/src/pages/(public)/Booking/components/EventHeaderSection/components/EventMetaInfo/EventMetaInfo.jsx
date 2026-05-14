import { Calendar, MapPin } from "lucide-react";

function EventMetaInfo() {
    return ( 
          <div className="flex items-center gap-20">
            <div className="flex items-start gap-4 group">
            <Calendar
                color="var(--text-primary)"
                className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
            />
            <div className="flex flex-col items-start">
                <p className="text-(--text-primary)">20 - 21/06/2026</p>
                <p className="text-(--text-primary)/60">16:00 - 23:00</p>
            </div>
            </div>

            <div className="flex items-start gap-4 group">
            <MapPin
                color="var(--text-primary)"
                className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
            />
            <div className="flex flex-col items-start">
                <p className="text-(--text-primary)">Location</p>
                <p className="text-(--text-primary)/60">Đa Phước, Bình Chánh, TP.HCM</p>
            </div>
            </div>
        </div>
     );
}

export default EventMetaInfo;