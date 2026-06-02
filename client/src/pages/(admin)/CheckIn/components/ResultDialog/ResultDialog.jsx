import {
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CHECKIN_LOG_STATUS_LABELS } from '@/pages/(admin)/CheckInLogs/data';


function ResultDialog({
  notice,
  onOpenChange,
}) {
  const isSuccess =
    notice?.status === 'VALID';

  return (
    <Dialog
      open={Boolean(notice)}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            {isSuccess ? (
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="size-5 text-destructive" />
            )}

            <DialogTitle>
              {isSuccess
                ? 'Check-in hợp lệ'
                : notice?.status ===
                    'DUPLICATE'
                  ? 'Quét trùng'
                  : 'Token không hợp lệ'}
            </DialogTitle>
          </div>

          <DialogDescription>
            {notice?.message ||
              'Đã xử lý lượt quét QR.'}
          </DialogDescription>
        </DialogHeader>

        {notice && (
          <div className="px-3 py-2 text-sm border rounded-lg border-border bg-muted/30">
            <span className="text-muted-foreground">
              Trạng thái:
            </span>{' '}
            <span className="font-medium">
              {CHECKIN_LOG_STATUS_LABELS[
                notice.status
              ] ?? notice.status}
            </span>
          </div>
        )}

        <DialogFooter className="p-0 mx-0 mb-0 bg-transparent border-t-0">
          <Button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Đã hiểu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResultDialog;