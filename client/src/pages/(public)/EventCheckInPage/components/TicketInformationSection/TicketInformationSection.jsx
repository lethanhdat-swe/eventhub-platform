import { Armchair, CalendarDays, Crown, ScanBarcode, User } from "lucide-react";

function Row({ icon, label, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-(--text-primary)/10 last:border-0 last:pb-0 group">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-(--primary-color)/10 group-hover:bg-(--primary-color)/20 transition-colors duration-200">
          {icon}
        </div>
        <p className="text-(--text-primary)/50 font-medium uppercase tracking-widest">{label}</p>
      </div>
      <div className="text-right">{children}</div>
    </div>
  );
}

function TicketInformationSection({event}) {
  return (
    <div
      className="
        relative w-full max-w-xl flex flex-col gap-1 p-6 rounded-3xl
        border border-(--primary-color)/20 bg-(--surface-color)
        overflow-hidden
        hover:border-(--primary-color)/50
        hover:-translate-y-1.5
        will-change-transform
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
      "
    >
      {/* Overlay gradient fade in khi hover — dùng thẻ div thay vì before: */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-(--primary-color)/8 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Shimmer line trên */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-(--primary-color)/60 to-transparent" />

      {/* Shimmer line dưới */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-(--primary-color)/30 to-transparent" />

      {/* Title */}
      <h1 className="text-(--primary-color) text-center font-semibold tracking-[0.3em] uppercase opacity-60 mb-2">
        --- Thông tin vé ---
      </h1>

      <Row icon={<Crown size={15} color="var(--primary-color)" />} label="Hạng vé">
        <span className="font-bold tracking-widest px-3 py-1 rounded-full bg-(--primary-color)/15 text-(--primary-color) uppercase">
          {event.zone}
        </span>
      </Row>

      <Row icon={<Armchair size={15} color="var(--primary-color)" />} label="Số ghế">
        <span className="text-(--text-primary) font-semibold tracking-widest">A1 – 08</span>
      </Row>

      <Row icon={<User size={15} color="var(--primary-color)" />} label="Người đặt vé">
        <span className="text-(--text-primary) font-semibold">Thái Thanh Quân</span>
      </Row>

      <Row icon={<CalendarDays size={15} color="var(--primary-color)" />} label="Sự kiện">
        <div className="flex flex-col items-end gap-0.5">
          <h2 className="text-base font-bold tracking-wider text-transparent uppercase bg-linear-to-r from-fuchsia-400 to-blue-400 bg-clip-text">
            NEON COUNTDOWN 2025
          </h2>
          <p className="text-(--text-primary)/60">{event.date}</p>
          <p className="text-(--text-primary)/40">{event.location}</p>
        </div>
      </Row>

      <Row icon={<ScanBarcode size={15} color="var(--primary-color)" />} label="Mã vé">
        <span className="font-mono font-semibold tracking-[0.2em] text-(--primary-color) uppercase opacity-80">
          {event.ticketCode}
        </span>
      </Row>
    </div>
  );
}

export default TicketInformationSection;