import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  formatCheckedInAt,
  formatSeatLabel,
  getTicketQrImageUrl,
} from '@/pages/(admin)/Tickets/data';

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

function CheckInBadge({ isCheckedIn }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        isCheckedIn
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-border bg-muted text-muted-foreground'
      )}
    >
      {isCheckedIn ? 'Đã check-in' : 'Chưa check-in'}
    </Badge>
  );
}

function TicketDetailDialog({ open, onOpenChange, ticket, loading = false }) {
  const qrUrl = ticket ? getTicketQrImageUrl(ticket.qrSecureToken) : null;
  const seat = ticket?.eventSeat;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Chi tiết vé</DialogTitle>
          <DialogDescription>Thông tin vé và mã QR check-in.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Đang tải...</p>
        ) : ticket ? (
          <div className="grid max-h-[min(70vh,560px)] gap-3 overflow-y-auto py-2">
            <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/20 p-4">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Mã QR vé"
                  className="size-[200px] rounded-md bg-white object-contain"
                />
              ) : (
                <div className="flex size-[200px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  Không có mã QR
                </div>
              )}
              <p className="w-full break-all text-center font-mono text-xs text-muted-foreground">
                {ticket.qrSecureToken}
              </p>
            </div>

            <DetailField
              id="ticket-order-code"
              label="Mã đơn hàng"
              value={ticket.order?.orderCode}
            />
            <DetailField
              id="ticket-customer-name"
              label="Khách hàng"
              value={ticket.order?.customerName}
            />
            <DetailField
              id="ticket-customer-email"
              label="Email"
              value={ticket.order?.customerEmail}
            />
            <DetailField
              id="ticket-customer-phone"
              label="Số điện thoại"
              value={ticket.order?.customerPhone}
            />
            <DetailField
              id="ticket-event"
              label="Sự kiện"
              value={ticket.eventSeat?.event?.title}
            />
            <DetailField
              id="ticket-seat"
              label="Ghế"
              value={formatSeatLabel(seat)}
            />
            <DetailField
              id="ticket-type"
              label="Loại vé"
              value={ticket.eventSeat?.ticketType?.name}
            />
            <div className="space-y-1.5">
              <Label>Trạng thái check-in</Label>
              <CheckInBadge isCheckedIn={ticket.isCheckedIn} />
            </div>
            <DetailField
              id="ticket-checked-in-at"
              label="Thời gian check-in"
              value={formatCheckedInAt(ticket.checkedInAt)}
            />
            <DetailField id="ticket-order-id" label="Order ID" value={ticket.orderId} />
            <DetailField
              id="ticket-event-seat-id"
              label="Event seat ID"
              value={ticket.eventSeatId}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default TicketDetailDialog;
