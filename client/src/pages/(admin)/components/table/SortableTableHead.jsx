import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TABLE_SORT_ORDER } from '@/pages/(admin)/components/table/tableSort';

function SortableTableHead({
  field,
  label,
  sortBy,
  sortOrder,
  onSort,
  className,
  align = 'left',
}) {
  const isActive = sortBy === field;

  const SortIcon = !isActive
    ? ArrowUpDown
    : sortOrder === TABLE_SORT_ORDER.ASC
      ? ArrowUp
      : ArrowDown;

  return (
    <TableHead
      className={cn(
        'h-9 px-2',
        align === 'right' && 'text-right',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          'inline-flex max-w-full items-center gap-1 text-left font-medium transition-colors',
          align === 'right' && 'ml-auto',
          isActive
            ? 'text-foreground'
            : 'text-foreground/80 hover:text-foreground'
        )}
        aria-sort={
          isActive
            ? sortOrder === TABLE_SORT_ORDER.ASC
              ? 'ascending'
              : 'descending'
            : 'none'
        }
      >
        <span className="truncate">{label}</span>
        <SortIcon
          className={cn(
            'size-3.5 shrink-0',
            isActive ? 'text-foreground' : 'text-muted-foreground/70'
          )}
          aria-hidden
        />
      </button>
    </TableHead>
  );
}

export default SortableTableHead;
