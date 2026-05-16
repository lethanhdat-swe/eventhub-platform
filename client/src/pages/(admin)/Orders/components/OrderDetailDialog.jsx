import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OrderStatusBadge from '@/pages/(admin)/Orders/components/OrderStatusBadge';
import {
  formatCouponLabel,
  formatCreatedAt,
  formatOrderSeatLines,
  formatPaymentMethod,
  formatPriceVnd,
} from '@/pages/(admin)/Orders/data';

function DetailField({ id, label, value }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value ?? '—'}
        readOnly
        className="h-9 bg-muted"
      />
    </div>
  );
}

function OrderDetailDialog({ open, onOpenChange, order, loading = false }) {
  const seatLines = order ? formatOrderSeatLines(order) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          <DialogDescription>
            Thông tin đơn hàng chỉ đọc.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Đang tải...</p>
        ) : order ? (
          <div className="grid max-h-[min(70vh,560px)] gap-3 overflow-y-auto py-2">
            <DetailField
              id="order-code"
              label="Mã đơn hàng"
              value={order.orderCode}
            />
            <DetailField
              id="order-customer-name"
              label="Khách hàng"
              value={order.customerName}
            />
            <DetailField
              id="order-customer-email"
              label="Email"
              value={order.customerEmail}
            />
            <DetailField
              id="order-customer-phone"
              label="Số điện thoại"
              value={order.customerPhone}
            />
            <DetailField
              id="order-total"
              label="Tổng tiền"
              value={formatPriceVnd(order.totalAmount)}
            />
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <OrderStatusBadge status={order.status} />
            </div>
            <DetailField
              id="order-payment-method"
              label="Phương thức thanh toán"
              value={formatPaymentMethod(order.paymentMethod)}
            />
            <DetailField
              id="order-sepay-tx"
              label="Mã giao dịch SePay"
              value={order.sepayTransactionId}
            />
            <DetailField
              id="order-coupon"
              label="Mã giảm giá"
              value={formatCouponLabel(order.coupon)}
            />
            <DetailField
              id="order-user"
              label="Tài khoản"
              value={
                order.user
                  ? [order.user.fullName, order.user.email]
                      .filter(Boolean)
                      .join(' · ')
                  : order.userId
              }
            />
            <DetailField
              id="order-created-at"
              label="Ngày tạo"
              value={formatCreatedAt(order.createdAt)}
            />
            <DetailField
              id="order-updated-at"
              label="Cập nhật lần cuối"
              value={formatCreatedAt(order.updatedAt)}
            />
            {seatLines.length > 0 ? (
              <div className="space-y-1.5">
                <Label>Ghế / vé</Label>
                <ul className="list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
                  {seatLines.map((line, index) => (
                    <li key={`${line}-${index}`}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailDialog;
