import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PAYMENT_TRANSACTION_STATUS_LABELS } from '@/pages/(admin)/PaymentTransactions/data';

const statusStyles = {
  PENDING:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
  MATCHED:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  UNMATCHED:
    'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
  FAILED:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
};

function PaymentTransactionStatusBadge({ status, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        statusStyles[status] ?? 'border-border bg-muted text-muted-foreground',
        className
      )}
    >
      {PAYMENT_TRANSACTION_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export default PaymentTransactionStatusBadge;
