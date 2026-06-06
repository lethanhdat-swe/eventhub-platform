import { AlertCircle, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { isEventEnded } from '@/utils/eventDate';
import { validateCustomerInfo } from '@/utils/formValidation';

function CheckoutButton({
  event,
  selectedSeats = [],
  selectedSeatIds = [],
  customerInfo,
}) {
  const [didTryCheckout, setDidTryCheckout] = useState(false);
  const ended = isEventEnded(event);

  const validationErrors = useMemo(
    () =>
      validateCustomerInfo({
        name: customerInfo?.name,
        email: customerInfo?.email,
        phone: customerInfo?.phone,
      }),
    [customerInfo]
  );

  const canCheckout =
    !ended &&
    selectedSeatIds.length > 0 &&
    Object.keys(validationErrors).length === 0;

  const errorMessage = useMemo(() => {
    if (ended) {
      return 'Sự kiện này đã kết thúc. Bạn không thể đặt vé mới.';
    }

    const parts = [];
    if (selectedSeatIds.length === 0) {
      parts.push('chọn ít nhất 1 ghế');
    }
    Object.values(validationErrors).forEach((message) => parts.push(message));

    if (parts.length === 0) return '';

    const hasFullSentence = parts.some((part) => part.endsWith('.'));
    return hasFullSentence
      ? parts.join(' ')
      : `Bạn cần ${parts.join(', ')} trước khi thanh toán.`;
  }, [ended, selectedSeatIds.length, validationErrors]);

  return (
    <div className="mt-4 flex w-full flex-col gap-3 border-t border-(--text-primary)/10 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-(--text-primary)">
            Thanh toán đơn hàng
          </p>

          <p className="mt-1 text-xs text-(--text-primary)/45">
            Kiểm tra thông tin trước khi tiếp tục.
          </p>
        </div>

        {ended ? (
          <button
            type="button"
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-(--text-primary)/10 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-(--muted-text) sm:w-auto sm:min-w-47.5"
          >
            Không thể đặt vé
          </button>
        ) : (
          <Link
            to="/payment"
            state={{ event, selectedSeats, selectedSeatIds, customerInfo }}
            onClick={(e) => {
              if (!canCheckout) {
                e.preventDefault();
                setDidTryCheckout(true);
              }
            }}
            className="
              group inline-flex w-full items-center justify-center gap-2 rounded-xl
              bg-(--primary-color) px-6 py-3.5 text-sm font-black uppercase tracking-wide
              text-white shadow-[0_14px_40px_rgba(168,85,247,0.3)]
              transition-all duration-300
              hover:-translate-y-0.5 hover:brightness-110
              active:scale-95
              sm:w-auto sm:min-w-47.5
            "
          >
            Thanh toán
            <ChevronRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>

      {didTryCheckout && !canCheckout ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/15 bg-red-500/10 px-3.5 py-3 text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p className="text-sm leading-5">{errorMessage}</p>
        </div>
      ) : null}
    </div>
  );
}

export default CheckoutButton;
