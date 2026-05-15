import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { getAdminBreadcrumbs } from './AdminNavConfig';

function AdminHeader({ onMenuToggle }) {
  const { pathname } = useLocation();
  const breadcrumbs = getAdminBreadcrumbs(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuToggle}
        aria-label="Mở hoặc đóng thanh bên"
      >
        <Menu className="size-5" />
      </Button>

      <nav aria-label="Đường dẫn" className="min-w-0 flex-1">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li className="text-muted-foreground">Quản trị</li>
          {breadcrumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              <span
                className={cn(
                  index === breadcrumbs.length - 1
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {crumb.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative size-9 rounded-full"
          aria-label="Thông báo"
        >
          <Bell className="size-4" />
          <span
            className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background"
            aria-hidden
          />
        </Button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
          aria-label="Menu tài khoản quản trị"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            Q
          </span>
          <span className="hidden font-medium sm:inline">Quản trị viên</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
