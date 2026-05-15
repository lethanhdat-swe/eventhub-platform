import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCheckInTime } from '@/pages/(admin)/CheckIn/data';

function ResultRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function CheckInResultCard({ result }) {
  if (!result) return null;

  const isSuccess = result.type === 'success';
  const ticket = result.ticket;

  return (
    <Card
      className={cn(
        'gap-0 py-0 ring-2',
        isSuccess
          ? 'ring-emerald-500/30 dark:ring-emerald-500/40'
          : 'ring-destructive/30 dark:ring-destructive/40'
      )}
    >
      <CardHeader
        className={cn(
          'flex flex-row items-center gap-2 border-b px-4 py-3',
          isSuccess
            ? 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/40'
            : 'border-destructive/20 bg-destructive/5'
        )}
      >
        {isSuccess ? (
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <AlertCircle className="size-5 shrink-0 text-destructive" />
        )}
        <CardTitle className="text-base">
          {isSuccess ? 'Check-in thành công' : 'Check-in thất bại'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 py-4">
        <p className="text-sm text-muted-foreground">{result.message}</p>
        {ticket ? (
          <div className="space-y-2 border-t border-border pt-3">
            <ResultRow label="Mã vé" value={ticket.ticketCode} />
            <ResultRow label="Khách hàng" value={ticket.customerName} />
            <ResultRow label="Sự kiện" value={ticket.eventTitle} />
            <ResultRow label="Ghế" value={ticket.seatLabel} />
            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Trạng thái</span>
              <Badge
                variant="outline"
                className={cn(
                  'h-5 rounded-md px-1.5 text-xs font-medium',
                  isSuccess
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'border-border bg-muted text-muted-foreground'
                )}
              >
                {isSuccess ? 'Đã check-in' : 'Chưa check-in'}
              </Badge>
            </div>
            <ResultRow
              label="Thời gian check-in"
              value={formatCheckInTime(
                isSuccess ? result.checkedInAt : ticket.checkedInAt
              )}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default CheckInResultCard;
