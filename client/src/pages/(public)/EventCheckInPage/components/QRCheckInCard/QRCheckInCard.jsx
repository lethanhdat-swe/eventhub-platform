import { images } from "@/assets";

function QRCheckInCard() {
  return (
    <div className="relative flex flex-col items-center gap-4 p-6 rounded-3xl border border-(--primary-color)/40 bg-(--surface-color) overflow-hidden group hover:border-(--primary-color)/70 transition-all duration-500 hover:shadow-[0_0_32px_var(--primary-color)] w-fit">
      
      {/* Góc trang trí */}
      <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-(--primary-color) rounded-tl-3xl" />
      <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-(--primary-color) rounded-tr-3xl" />
      <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-(--primary-color) rounded-bl-3xl" />
      <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-(--primary-color) rounded-br-3xl" />

      {/* Scan line animation */}
      <div className="absolute left-6 right-6 h-px bg-(--primary-color)/60 top-[30%] animate-[scanline_2.5s_ease-in-out_infinite]" />

      {/* Title */}
      <h1 className="text-(--primary-color) text-sm font-semibold tracking-[0.25em] uppercase opacity-80">
        --- Mã Check In ---
      </h1>

      {/* QR wrapper */}
      <div className="relative p-3 rounded-2xl border border-(--primary-color)/20 bg-(--surface-color) group-hover:scale-105 transition-transform duration-500">
        <img
          src={images.qr}
          alt="QR Check In"
          className="object-cover w-48 h-48 rounded-xl"
        />
        {/* Overlay shimmer */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-(--primary-color)/0 via-(--primary-color)/10 to-(--primary-color)/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Footer */}
      <p className="text-(--text-primary) text-xs opacity-40 tracking-widest uppercase">
        Quét để xác nhận
      </p>
    </div>
  );
}

export default QRCheckInCard;