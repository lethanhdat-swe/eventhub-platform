import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';

import { getErrorMessage } from '@/lib/http/apiError';
import { orderService } from '@/lib/services/admin/orderService';

import OrderLookupResultPanel from './OrderLookupResultPanel';

function validateOrderCodeInput(code) {
  const trimmed = code.trim();

  if (!trimmed) {
    return 'Vui lòng nhập mã đơn hàng.';
  }

  if (!/^EH/i.test(trimmed)) {
    return 'Mã đơn hàng phải bắt đầu bằng EH (ví dụ: EH1730...).';
  }

  return null;
}

function RefundLookupActionWidget() {
  const [orderCode, setOrderCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lookedUpOrder, setLookedUpOrder] = useState(null);

  const handleLookup = async () => {
    const code = orderCode.trim();
    const validationError = validateOrderCodeInput(code);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const order = await orderService.lookupByOrderCode(code);
      setLookedUpOrder(order);
    } catch (err) {
      setLookedUpOrder(null);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLookup();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={orderCode}
          onChange={(event) => {
            setOrderCode(event.target.value);
            if (error) setError(null);
            if (lookedUpOrder) setLookedUpOrder(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Mã đơn (EH...)"
          aria-label="Mã đơn hàng"
          className="h-9 min-w-0 flex-1 rounded-lg border border-(--border-color) bg-(--surface-color) px-2.5 text-xs text-(--text-primary) outline-none transition placeholder:text-(--muted-text) focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/25 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleLookup}
          disabled={isLoading}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-(--primary-color) px-3 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <Search size={14} aria-hidden />
          )}
          Tra cứu
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-400/25 bg-red-400/10 px-2.5 py-1.5 text-xs text-red-300"
        >
          {error}
        </p>
      ) : null}

      {lookedUpOrder ? <OrderLookupResultPanel order={lookedUpOrder} /> : null}
    </div>
  );
}

export default RefundLookupActionWidget;
