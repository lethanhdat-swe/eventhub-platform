import { CalendarDays } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { adminNavSections, isNavItemActive } from './AdminNavConfig';

function AdminSidebar({ open, onClose }) {
    const { pathname } = useLocation();

    return (
        <>
            {open ? (
                <button
                    type="button"
                    aria-label="Đóng thanh bên"
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            ) : null}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
                    <NavLink
                        to="/admin/dashboard"
                        className="flex items-center gap-2 font-semibold tracking-tight"
                        onClick={onClose}
                    >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <CalendarDays className="size-4" />
                        </span>
                        <span className="text-sm">Quản trị EventHub</span>
                    </NavLink>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    {adminNavSections.map((section) => (
                        <div key={section.title} className="mb-4 last:mb-0">
                            <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
                                {section.title}
                            </p>
                            <ul className="space-y-0.5">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isNavItemActive(
                                        pathname,
                                        item
                                    );

                                    return (
                                        <li key={item.to}>
                                            <NavLink
                                                to={item.to}
                                                onClick={onClose}
                                                className={cn(
                                                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                                                    active
                                                        ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                                )}
                                            >
                                                <Icon className="size-4 shrink-0" />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}

export default AdminSidebar;
