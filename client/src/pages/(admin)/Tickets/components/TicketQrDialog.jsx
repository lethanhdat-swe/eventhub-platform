import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function TicketQrDialog({ open, ticket, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton>
        <DialogHeader>
          <DialogTitle>Mã QR vé</DialogTitle>
          <DialogDescription>
            Mã QR cho vé {ticket?.ticketCode ?? ''} — xem trước placeholder.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex aspect-square w-full max-w-[200px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            QR placeholder
          </div>
          <p className="w-full break-all text-center font-mono text-xs text-muted-foreground">
            {ticket?.qrSecureToken ?? '—'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TicketQrDialog;
