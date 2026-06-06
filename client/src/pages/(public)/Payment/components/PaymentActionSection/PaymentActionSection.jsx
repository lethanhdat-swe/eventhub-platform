import { Loader2, LockKeyhole, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";

function PaymentActionSection({ canSubmit, isSubmitting, onSubmit, backTo }) {
    return ( 
        <div className="flex flex-col-reverse gap-3 mt-6 mb-5 sm:grid sm:grid-cols-2 sm:gap-4">
            <Link
                to={backTo ?? "/booking"}
                className="group rounded-xl border border-(--text-primary)/10 bg-(--text-primary)/3 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-center gap-3 transition-all duration-200 hover:border-(--text-primary)/20 hover:bg-(--text-primary)/5"
            >
                <Undo2 size={18} className="transition-all duration-200 text-(--text-primary)/90 group-hover:-translate-x-1 shrink-0" />
                <p className="font-semibold text-(--text-primary) text-sm sm:text-base">Quay lại</p>
            </Link>

            <button
                type="button"
                disabled={!canSubmit || isSubmitting}
                onClick={onSubmit}
                className="rounded-xl px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-center gap-3 bg-(--primary-color) text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <p className="text-sm font-semibold sm:text-base">
                    {isSubmitting ? "Đang tạo đơn hàng..." : "Thanh toán ngay"}
                </p>
                {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin shrink-0" />
                ) : (
                    <LockKeyhole size={18} className="shrink-0" />
                )}
            </button>
        </div>
    );
}

export default PaymentActionSection;