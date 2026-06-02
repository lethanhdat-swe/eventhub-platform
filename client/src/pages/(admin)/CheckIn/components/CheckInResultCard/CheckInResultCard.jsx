import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  CHECKIN_LOG_STATUS_LABELS,
  formatCheckInTime,
  getShortToken,
} from '@/pages/(admin)/CheckIn/data';

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

  const isSuccess = result.status === 'VALID';
  const isDuplicate = result.status === 'DUPLICATE';
  const statusClassName =
    result.status === 'VALID'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
      : result.status === 'DUPLICATE'
        ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
        : 'border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40';

  return (
    <Card
      className={cn(
        'gap-0 py-0 ring-2',
        isSuccess
          ? 'ring-emerald-500/30 dark:ring-emerald-500/40'
          : isDuplicate
            ? 'ring-amber-500/30 dark:ring-amber-500/40'
            : 'ring-destructive/30 dark:ring-destructive/40'
      )}
    >
      <CardHeader
        className={cn(
          'flex flex-row items-center gap-2 border-b px-4 py-3',
          isSuccess
            ? 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/40'
            : isDuplicate
              ? 'border-amber-200/80 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/40'
              : 'border-destructive/20 bg-destructive/5'
        )}
      >
        {isSuccess ? (
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : isDuplicate ? (
          <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        ) : (
          <AlertCircle className="size-5 shrink-0 text-destructive" />
        )}
        <CardTitle className="text-base">
          {isSuccess
            ? 'Quét QR hợp lệ'
            : isDuplicate
              ? 'Quét trùng'
              : 'Không hợp lệ'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 py-4">
        <p className="text-sm text-muted-foreground">{result.message}</p>
        <div className="space-y-2 border-t border-border pt-3">
          <ResultRow label="Token" value={getShortToken(result.token)} />
          <ResultRow label="Vé liên kết" value={result.ticketId || '-'} />
          <ResultRow label="Sự kiện" value={result.eventTitle || '-'} />
          <ResultRow label="Ghế" value={result.seatLabel || '-'} />
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Trạng thái</span>
            <Badge
              variant="outline"
              className={cn(
                'h-5 rounded-md px-1.5 text-xs font-medium',
                statusClassName
              )}
            >
              {CHECKIN_LOG_STATUS_LABELS[result.status] ?? result.status}
            </Badge>
          </div>
          <ResultRow
            label="Thời gian quét"
            value={formatCheckInTime(result.scannedAt)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CheckInResultCard;
