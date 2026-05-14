import { Calendar, MapPin } from "lucide-react";

function EventInfoCard() {
    return ( 
        <div className="space-y-5">
             <h1 className="text-(--text-primary) text-2xl font-medium">Neon Dreams Live Concert 2025</h1>
                     <div className="flex items-center gap-4 group">
                        <MapPin
                            color="var(--text-primary)"
                            className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
                        />
                            <p className="text-(--text-primary)/60">Đa Phước, Bình Chánh, TP.HCM</p>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <Calendar
                            color="var(--text-primary)"
                            className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
                        />
                            <p className="text-(--text-primary)/60">31/05/2025 - 20:00</p>
                    </div>
        </div>
     );
}

export default EventInfoCard;