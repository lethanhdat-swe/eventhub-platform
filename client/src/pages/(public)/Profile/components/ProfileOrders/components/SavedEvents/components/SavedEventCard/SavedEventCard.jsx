import { images } from "@/assets";
import { Calendar, ChevronRight, Clock, MapPin, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";

function SavedEventCard({ event }) {
  return (
    <div className="w-full flex items-stretch gap-6 border-b border-(--text-primary)/10 px-6 py-5">

      {/* LEFT — thumbnail + info */}
      <div className="flex flex-1 min-w-0 items-center gap-5 pr-8 border-r border-(--text-primary)/10">
        <img
          src={images.home}
          alt=""
          className="object-cover h-35 w-55 shrink-0 rounded-3xl"
        />

        <div className="flex flex-col min-w-0 gap-3">
          <h1 className="truncate text-3xl font-bold text-(--text-primary)">
            {event.ten}
          </h1>

          <div className="flex items-center gap-2 text-(--text-primary)/60">
            <MapPin size={18} />
            <p className="truncate">{event.dia_diem}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {event.the_loai.map((tl, index) => (
              <span
                key={index}
                className="px-4 py-1.5 rounded-full border border-(--primary-color)/40 bg-(--primary-color)/10 text-(--primary-color) text-sm"
              >
                {tl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* TICKET */}
      <div className="flex flex-col items-center justify-center px-10 border-r border-(--text-primary)/10">
        <p className={`text-3xl font-bold ${event.sap_het_ve ? "text-red-500" : "text-green-500"}`}>
            {event.ve_con_lai}
        </p>
        <p className="mt-1 text-(--text-primary)/60">Vé còn lại</p>
        {event.sap_het_ve && (
            <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm">
            <TriangleAlert /> 
            <span>Sắp hết vé!</span>
            </div>
        )}
        </div>

      {/* TIME */}
      <div className="flex flex-col justify-center gap-5 px-10">
        <div className="flex items-center gap-3 text-(--text-primary)/60">
          <Calendar size={18} />
          <p>{event.ngay}</p>
        </div>
        <div className="flex items-center gap-3 text-(--text-primary)/60">
          <Clock size={18} />
          <p>{event.gio}</p>
        </div>
      </div>

      {/* ACTION */}
      <Link
        to="/events"
        className="flex shrink-0 self-center items-center justify-center h-14 w-14 rounded-full border border-(--text-primary)/10 bg-(--text-primary)/5 text-(--text-primary)/70 transition-all duration-300 hover:bg-(--primary-color) hover:text-(--text-primary) hover:scale-110"
      >
        <ChevronRight size={22} />
      </Link>

    </div>
  );
}

export default SavedEventCard;