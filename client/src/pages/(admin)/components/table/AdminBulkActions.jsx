import { cn } from '@/lib/utils';

function AdminBulkActions({ selectedCount, label, children, className }) {
  if (!selectedCount || selectedCount <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2',
        className
      )}
    >
      <p className="text-sm font-medium leading-none">{label}</p>
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}

export default AdminBulkActions;
