import { BadgeCheck, QrCode, ShieldCheck, TicketCheck } from 'lucide-react';

function EventOrganizer() {
  return (
    <section className="rounded-2xl border border-(--border-color) bg-(--card-surface-color) p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--primary-color)">
          EventHub Guarantee
        </p>

        <h2 className="mt-1 text-lg font-black tracking-tight text-(--text-primary)">
          An tâm khi đặt vé
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-(--muted-text)">
          Vé điện tử được quản lý trực tiếp trên EventHub, thuận tiện cho thanh
          toán, lưu trữ và check-in tại sự kiện.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/15 text-(--primary-color)">
            <TicketCheck size={19} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              Vé điện tử
            </h3>

            <p className="mt-0.5 text-sm leading-relaxed text-(--muted-text)">
              Nhận vé nhanh chóng sau khi thanh toán thành công.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/15 text-(--primary-color)">
            <QrCode size={19} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              Check-in bằng QR
            </h3>

            <p className="mt-0.5 text-sm leading-relaxed text-(--muted-text)">
              Mỗi vé có mã QR riêng để sử dụng khi tham dự sự kiện.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/15 text-(--primary-color)">
            <ShieldCheck size={19} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              Thông tin rõ ràng
            </h3>

            <p className="mt-0.5 text-sm leading-relaxed text-(--muted-text)">
              Theo dõi thông tin sự kiện, vé và đơn hàng ngay trên hệ thống.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-(--border-color) bg-(--soft-surface-color) px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold text-(--text-primary)">
          <BadgeCheck
            size={17}
            className="text-white"
            fill="var(--primary-color)"
          />
          Được hỗ trợ bởi EventHub
        </div>
      </div>
    </section>
  );
}

export default EventOrganizer;
