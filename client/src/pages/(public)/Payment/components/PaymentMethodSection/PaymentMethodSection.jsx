import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { formatVndAmount } from '@/utils/formatters';

function formatCurrency(value) {
  return formatVndAmount(value, { suffix: 'đ' });
}

function PaymentMethodSection({
  subtotal = 0,
  discountAmount = 0,
  totalAmount = 0,
  ticketCount = 0,
  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  appliedCouponCode,
  couponError,
  couponSuccess,
  isApplyingCoupon = false,
}) {
  const hasAppliedCoupon = Boolean(appliedCouponCode);
  const canApplyCoupon = Boolean(couponCode?.trim()) && !isApplyingCoupon;

  return (
    <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-(--text-primary) font-semibold">Tổng tiền</h2>
          <p className="text-(--text-primary)/50 text-sm">
            {ticketCount} vé đã chọn
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={couponCode}
          onChange={(event) => onCouponCodeChange?.(event.target.value)}
          placeholder="Nhập mã giảm giá"
          className="h-10 border-(--text-primary)/10 bg-(--surface-color)/30 text-(--text-primary)"
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-10 px-4"
          onClick={onApplyCoupon}
          disabled={!canApplyCoupon}
        >
          {isApplyingCoupon ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang áp dụng
            </>
          ) : (
            "Áp dụng"
          )}
        </Button>
      </div>

      {couponError ? (
        <p className="mt-2 text-xs text-red-500">{couponError}</p>
      ) : null}

      {hasAppliedCoupon && couponSuccess ? (
        <p className="mt-2 text-xs text-emerald-500">
          {couponSuccess}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t border-(--text-primary)/10 pt-4">
        <div className="flex items-center justify-between text-sm">
          <p className="text-(--text-primary)/60">Tạm tính</p>

          <p className="text-(--text-primary) font-medium">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-(--text-primary)/60">Giảm giá</p>

          <p className="text-emerald-500 font-medium">
            -{formatCurrency(discountAmount)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-(--text-primary) font-semibold">
            Tổng thanh toán
          </h3>

          <p className="text-(--text-primary)/50 text-xs">
            Mã giảm giá sẽ được kiểm tra lại khi tạo đơn hàng
          </p>
        </div>

        <p className="text-(--primary-color) text-2xl font-bold tracking-tight">
          {formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
}

export default PaymentMethodSection;
