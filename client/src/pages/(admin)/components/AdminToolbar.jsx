import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function AdminToolbar({
  searchPlaceholder = 'Tìm kiếm...',
  onSearchChange,
  children,
  className,
}) {
  const showSearch = searchPlaceholder || onSearchChange;

  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3',
        className
      )}
    >
      {showSearch ? (
        <div className="relative w-full sm:max-w-[360px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="h-9 pl-9"
          />
        </div>
      ) : null}

      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}

export default AdminToolbar;
