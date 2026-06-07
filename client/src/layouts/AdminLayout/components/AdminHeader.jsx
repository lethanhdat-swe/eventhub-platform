import { useState } from 'react';
import {
    Bell,
    ChevronDown,
    Home,
    Loader2,
    LogOut,
    Menu,
    Settings,
    User,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authStorage } from '@/lib/auth/authStorage';
import { authService } from '@/lib/services/auth/authService';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

import { getAdminBreadcrumbs } from './AdminNavConfig';
import NotificationBell from './NotificationBell';

function AdminHeader({ onMenuToggle }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const breadcrumbs = getAdminBreadcrumbs(pathname);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            const refreshToken =
                useAuthStore.getState().refreshToken ??
                authStorage.getRefreshToken();
            if (refreshToken) {
                try {
                    await authService.logout({ refreshToken });
                } catch {
                    /* vẫn xóa auth local dù API lỗi */
                }
            }
        } finally {
            useAuthStore.getState().clearAuth();
            navigate('/login');
        }
    }

    return (
        <header className="flex items-center gap-3 px-4 border-b h-16 lg:h-14 shrink-0 border-border bg-background md:px-6">
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

            <nav aria-label="Đường dẫn" className="flex-1 min-w-0">
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    <li className="text-muted-foreground">Quản trị</li>
                    {breadcrumbs.map((crumb, index) => (
                        <li
                            key={`${crumb.label}-${index}`}
                            className="flex items-center gap-1.5"
                        >
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

            <div className="flex items-center gap-2 shrink-0 sm:gap-3">
                <NotificationBell />
                <DropdownMenu>
                    <DropdownMenuTrigger
                        disabled={isLoggingOut}
                        render={
                            <div
                                type="button"
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-popup-open:bg-muted"
                                aria-label="Menu tài khoản quản trị"
                            >
                                <span className="flex items-center justify-center text-xs font-medium rounded-full size-8 shrink-0 bg-muted text-muted-foreground">
                                    Q
                                </span>
                                <span className="hidden font-medium sm:inline">
                                    Quản trị viên
                                </span>
                                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                            </div>
                        }
                    />
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <Home className="size-4" />
                            Về trang chủ
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => navigate('/profile')}
                        >
                            <User className="size-4" />
                            Hồ sơ cá nhân
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => navigate('/admin/settings')}
                        >
                            <Settings className="size-4" />
                            Cài đặt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            disabled={isLoggingOut}
                            onClick={() => void handleLogout()}
                        >
                            {isLoggingOut ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <LogOut className="size-4" />
                            )}
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

export default AdminHeader;
