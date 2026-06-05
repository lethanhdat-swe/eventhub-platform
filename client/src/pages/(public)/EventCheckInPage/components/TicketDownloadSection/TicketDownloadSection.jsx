import { ImageIcon } from "lucide-react";

function TicketDownloadSection() {
    return ( 
    <div>
        <h1 className="text-(--primary-color) text-center font-semibold tracking-[0.3em] uppercase opacity-60 mb-2">
        --- Tải mã qr về máy ---
      </h1>

      <button
        className="
            group relative overflow-hidden
            flex items-center gap-4
            w-full rounded-2xl
            border border-(--primary-color)/20
            bg-linear-to-br from-(--background-color) to-(--background-color)/90
            px-6 py-5
            transition-all duration-500
            hover:-translate-y-1
            hover:border-(--primary-color)/40
            hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]
        "
        >
        <div
            className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-linear-to-r from-(--primary-color)/10 via-transparent to-(--primary-color)/10 group-hover:opacity-100"
        />

            <div
                className="relative flex items-center justify-center border h-14 w-14 rounded-xl border-(--primary-color)/20 bg-(--primary-color)/10"
            >
                <ImageIcon
                size={28}
                className="text-(--primary-color)"
                />
            </div>

            <div className="relative flex flex-col items-start">
                <h3 className="text-lg font-semibold text-(--text-primary)">
                Lưu ảnh QR
                </h3>

                <p className="text-sm text-(--text-primary)/50">
                Định dạng PNG
                </p>
            </div>
        </button>
    </div>
  );
}

export default TicketDownloadSection;