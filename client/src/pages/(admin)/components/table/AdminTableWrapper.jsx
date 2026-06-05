import { cn } from '@/lib/utils';

function AdminTableWrapper({ children, className }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card',
        className
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export default AdminTableWrapper;
