import { ArrowRight, RefreshCcw } from 'lucide-react';

function RefundFormActionWidget({ action, onActivate }) {
    const buttonLabel = action.label ?? 'Mở form hoàn vé';

    return (
        <button
            type="button"
            onClick={onActivate}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-(--primary-color) px-3 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95"
        >
            <RefreshCcw size={14} aria-hidden />
            {buttonLabel}
            <ArrowRight size={14} aria-hidden />
        </button>
    );
}

export default RefundFormActionWidget;
