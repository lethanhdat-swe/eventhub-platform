import { ArrowRight, RefreshCcw, ShieldCheck } from 'lucide-react';

const REFUND_POLICY_ITEMS = [
  { label: 'Trước 3 ngày', value: '100%' },
  { label: 'Trong 3 ngày', value: '50%' },
  { label: 'Đã diễn ra', value: '0%' },
];

const DEFAULT_DESCRIPTION =
  'Gửi yêu cầu hoàn vé trực tiếp trong chat. Hệ thống sẽ xác minh mã đơn, email và số điện thoại.';

function RefundFormActionWidget({ action, onActivate }) {
  const title = action.payload?.title ?? 'Yêu cầu hoàn vé';
  const description = action.payload?.description ?? DEFAULT_DESCRIPTION;
  const buttonLabel = action.label ?? 'Mở form hoàn vé';

  return (
    <div className="rounded-xl border border-(--primary-color)/25 bg-(--primary-color)/8 p-3">
      <div className="flex items-start gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--primary-color)/15 text-(--primary-color)">
          <RefreshCcw size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-(--primary-color)">
            Hoàn vé
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-(--text-primary)">
            {title}
          </p>
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-(--muted-text)">{description}</p>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {REFUND_POLICY_ITEMS.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-(--border-color)/80 bg-(--soft-surface-color)/80 px-2 py-1.5 text-center"
          >
            <p className="text-[10px] leading-tight text-(--muted-text)">{item.label}</p>
            <p className="mt-0.5 text-xs font-bold text-(--text-primary)">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-(--border-color)/70 bg-(--soft-surface-color)/60 px-2 py-1.5">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-(--primary-color)" />
        <p className="text-[11px] leading-relaxed text-(--muted-text)">
          Kiểm tra email sau khi gửi yêu cầu để theo dõi trạng thái xử lý.
        </p>
      </div>

      <button
        type="button"
        onClick={onActivate}
        className="mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-(--primary-color) px-3 text-xs font-semibold text-white transition hover:brightness-110"
      >
        {buttonLabel}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default RefundFormActionWidget;
