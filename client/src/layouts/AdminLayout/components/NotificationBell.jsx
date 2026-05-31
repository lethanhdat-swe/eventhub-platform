import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notificationService } from '@/lib/services/admin/notificationService';

const notificationTypeLabel = {
  USER_REGISTERED: 'Người dùng',
  ORDER_CREATED: 'Đơn hàng',
  PAYMENT_TRANSACTION_CREATED: 'Thanh toán',
  CONTACT_CREATED: 'Liên hệ',
  CHECKIN_CREATED: 'Check-in',
};

function formatTime(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString('vi-VN');
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const hasUnread = unreadCount > 0;

  const displayUnreadCount = useMemo(() => {
    if (unreadCount > 99) return '99+';
    return unreadCount;
  }, [unreadCount]);

  const fetchUnreadCount = async () => {
    const res = await notificationService.getUnreadCount();
    setUnreadCount(res.unreadCount ?? 0);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.list({
        page: 1,
        limit: 8,
      });

      setNotifications(res.items ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (open) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [open]);

  const handleMarkAsRead = async (notificationId) => {
    await notificationService.markAsRead(notificationId);

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );

    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    );

    setUnreadCount(0);
  };

  const handleDelete = async (notificationId) => {
    const deletedItem = notifications.find(
      (item) => item.id === notificationId
    );

    await notificationService.delete(notificationId);

    setNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId)
    );

    if (deletedItem && !deletedItem.isRead) {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full bg-white text-zinc-700 hover:bg-zinc-100"
        >
          <Bell size={18} />

          {hasUnread && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {displayUnreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-100 border border-zinc-200 bg-white p-0 shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Thông báo</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              {unreadCount > 0
                ? `${unreadCount} thông báo chưa đọc`
                : 'Không có thông báo chưa đọc'}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={!hasUnread}
            className="px-2 text-sm! text-zinc-600"
          >
            <CheckCheck size={14} className="mr-1" />
            Đọc hết
          </Button>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-zinc-500">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center px-4 text-sm text-zinc-500">
              Chưa có thông báo
            </div>
          ) : (
            <div className="divide-y divide-zinc-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (
                      (event.key === 'Enter' || event.key === ' ') &&
                      !notification.isRead
                    ) {
                      event.preventDefault();
                      handleMarkAsRead(notification.id);
                    }
                  }}
                  className={`group cursor-pointer px-4 py-3 transition ${
                    notification.isRead ? 'bg-white' : 'bg-red-50'
                  } hover:bg-zinc-50`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-medium text-zinc-700">
                          {notificationTypeLabel[notification.type] ||
                            'Hệ thống'}
                        </span>
                        <span>•</span>
                        <span>{formatTime(notification.createdAt)}</span>
                      </div>

                      <p className="line-clamp-1 text-sm font-semibold text-zinc-900">
                        {notification.title}
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-600">
                        {notification.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="mt-0.5 cursor-pointer shrink-0 rounded p-1 text-zinc-400 opacity-0 transition hover:bg-zinc-100 hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200">
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full justify-center text-sm! text-zinc-700 hover:bg-zinc-100"
            onClick={() => {
              setOpen(false);
              window.location.href = '/admin/notifications';
            }}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
