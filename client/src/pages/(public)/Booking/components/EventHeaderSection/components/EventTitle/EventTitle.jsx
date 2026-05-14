import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function EventTitle() {
    return ( 
        <>
            {/* Back link */}
            <Link
            to="/events"
            className="flex items-center gap-2 transition-all duration-200 w-fit group"
            >
            <ArrowLeft
                color="var(--text-primary)"
                className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <p className="text-(--text-primary)/60 group-hover:text-(--text-primary) transition-colors duration-200">
                Quay lại sự kiện
            </p>
            </Link>

            {/* Title + badge */}
            <div className="flex items-center gap-10">
            <p className="text-(--text-primary) text-3xl font-bold tracking-tight">
                NEON MUSIC FESTIVAL 2026
            </p>
            <p
                className="text-xs px-2 py-0.5 rounded-sm uppercase border text-center shrink-0"
                style={{
                color: "var(--primary-color)",
                backgroundColor: "color-mix(in srgb, var(--primary-color) 15%, transparent)",
                borderColor: "color-mix(in srgb, var(--primary-color) 30%, transparent)",
                }}
            >
                Music festival
            </p>
            </div>
        </>
     );
}

export default EventTitle;