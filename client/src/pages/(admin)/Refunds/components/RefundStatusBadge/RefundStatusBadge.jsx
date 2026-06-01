import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    REFUND_STATUS_LABELS,
    REFUND_STATUS_STYLES,
} from '@/pages/(admin)/Refunds/data';

function RefundStatusBadge({ status, className }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'h-5 shrink-0 whitespace-nowrap rounded-md px-1.5 text-xs font-medium',
                REFUND_STATUS_STYLES[status] ??
                    'border-border bg-muted text-muted-foreground',
                className
            )}
        >
            {REFUND_STATUS_LABELS[status] ?? status}
        </Badge>
    );
}

export default RefundStatusBadge;
