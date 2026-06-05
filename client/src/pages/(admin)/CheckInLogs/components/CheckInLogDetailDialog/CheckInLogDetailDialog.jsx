import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CheckInLogStatusBadge from '@/pages/(admin)/CheckInLogs/components/CheckInLogStatusBadge/CheckInLogStatusBadge';
import { formatCheckInTime } from '@/pages/(admin)/CheckInLogs/data';

const EMPTY_VALUE = '-';

function DetailField({ id, label, value, monospace = false }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value ?? EMPTY_VALUE}
        readOnly
        className={monospace ? 'h-9 bg-muted font-mono text-xs' : 'h-9 bg-muted'}
      />
    </div>
  );
}

function CheckInLogDetailDialog({ open, onOpenChange, log }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>Chi tiết lượt quét QR</DialogTitle>
          <DialogDescription>
            Thông tin nhật ký check-in và dữ liệu vé liên kết.
          </DialogDescription>
        </DialogHeader>

        {log ? (
          <div className="grid max-h-[min(70vh,560px)] gap-3 overflow-y-auto py-2">
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <div>
                <CheckInLogStatusBadge status={log.status} />
              </div>
            </div>

            <DetailField
              id="check-in-log-scanned-at"
              label="Thời gian quét"
              value={formatCheckInTime(log.scannedAt)}
            />
            <DetailField
              id="check-in-log-token"
              label="Token / Mã QR"
              value={log.token}
              monospace
            />
            <div className="space-y-1.5">
              <Label htmlFor="check-in-log-message">Nội dung</Label>
              <Textarea
                id="check-in-log-message"
                value={log.message || EMPTY_VALUE}
                readOnly
                className="min-h-20 resize-none bg-muted"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailField
                id="check-in-log-ticket-id"
                label="Vé liên kết"
                value={log.ticketId}
                monospace
              />
              <DetailField
                id="check-in-log-order-code"
                label="Mã đơn hàng"
                value={log.orderCode}
              />
              <DetailField
                id="check-in-log-customer"
                label="Khách hàng"
                value={log.customerName}
              />
              <DetailField
                id="check-in-log-ticket-type"
                label="Loại vé"
                value={log.ticketType}
              />
              <DetailField
                id="check-in-log-event"
                label="Sự kiện"
                value={log.eventTitle}
              />
              <DetailField
                id="check-in-log-seat"
                label="Ghế"
                value={log.seatLabel}
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default CheckInLogDetailDialog;
