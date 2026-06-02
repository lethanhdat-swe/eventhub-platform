import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PaymentTransactionStatusBadge from '@/pages/(admin)/PaymentTransactions/components/PaymentTransactionStatusBadge/PaymentTransactionStatusBadge';
import {
  formatCreatedAt,
  formatPriceVnd,
} from '@/pages/(admin)/PaymentTransactions/data';

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

function PaymentTransactionDetailDialog({
  open,
  onOpenChange,
  transaction,
  loading = false,
}) {
  const order = transaction?.order;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Chi tiết giao dịch thanh toán</DialogTitle>
          <DialogDescription>
            Thông tin giao dịch SePay và đơn hàng liên kết.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Đang tải...</p>
        ) : transaction ? (
          <div className="grid max-h-[min(70vh,560px)] gap-3 overflow-y-auto py-2">
            <DetailField
              id="payment-transaction-id"
              label="Mã giao dịch"
              value={transaction.transactionId}
            />
            <DetailField
              id="payment-transaction-order-code"
              label="Mã đơn"
              value={transaction.orderCode}
            />
            <DetailField
              id="payment-transaction-amount"
              label="Số tiền"
              value={formatPriceVnd(transaction.amount)}
            />
            <DetailField
              id="payment-transaction-content"
              label="Nội dung chuyển khoản"
              value={transaction.content}
            />
            <DetailField
              id="payment-transaction-gateway"
              label="Cổng thanh toán"
              value={transaction.gateway}
            />
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <PaymentTransactionStatusBadge status={transaction.status} />
            </div>
            <DetailField
              id="payment-transaction-created-at"
              label="Ngày tạo"
              value={formatCreatedAt(transaction.createdAt)}
            />
            <DetailField
              id="payment-transaction-updated-at"
              label="Cập nhật lần cuối"
              value={formatCreatedAt(transaction.updatedAt)}
            />

            <div className="mt-2 border-t border-border pt-3">
              <p className="text-sm font-medium">Thông tin đơn hàng</p>
              {order ? (
                <div className="mt-3 grid gap-3">
                  <DetailField
                    id="payment-transaction-linked-order-code"
                    label="Mã đơn hàng"
                    value={order.orderCode}
                  />
                  <DetailField
                    id="payment-transaction-customer-name"
                    label="Khách hàng"
                    value={order.customerName}
                  />
                  <DetailField
                    id="payment-transaction-customer-email"
                    label="Email"
                    value={order.customerEmail}
                  />
                  <DetailField
                    id="payment-transaction-customer-phone"
                    label="Số điện thoại"
                    value={order.customerPhone}
                  />
                  <DetailField
                    id="payment-transaction-order-total"
                    label="Tổng tiền"
                    value={formatPriceVnd(order.totalAmount)}
                  />
                  <DetailField
                    id="payment-transaction-order-status"
                    label="Trạng thái đơn"
                    value={order.status}
                  />
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Giao dịch này chưa khớp với đơn hàng nào.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default PaymentTransactionDetailDialog;
