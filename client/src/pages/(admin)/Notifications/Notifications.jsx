import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, Loader2, RefreshCw, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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

  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  });

  const [page, setPage] = useState(1);
  const [readFilter, setReadFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      isRead: readFilter,
      type: typeFilter,
    }),
    [page, readFilter, typeFilter]
  );

  const fetchNotifications = async () => {
    setIsLoading(true);

    try {
      const res = await notificationService.list(query);

      setNotifications(res.items ?? []);
      setMeta(
        res.meta ?? {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: page,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [query]);

  const handleMarkAsRead = async (notification) => {
    if (notification.isRead) return;

    await notificationService.markAsRead(notification.id);

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);

    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDelete = async (event, notificationId) => {
    event.stopPropagation();

    await notificationService.delete(notificationId);

    setNotifications((prev) =>
      prev.filter((item) => item.id !== notificationId)
    );

    setMeta((prev) => ({
      ...prev,
      totalItems: Math.max(prev.totalItems - 1, 0),
      itemCount: Math.max(prev.itemCount - 1, 0),
    }));
  };

  const canGoPrev = page > 1;
  const canGoNext = page < meta.totalPages;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={fetchNotifications}
            disabled={isLoading}
            className="h-10! rounded-xl px-4!"
          >
            <RefreshCw
              size={16}
              className={isLoading ? 'mr-2 animate-spin' : 'mr-2'}
            />
            Làm mới
          </Button>

          <Button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || notifications.length === 0}
            className="h-10! rounded-xl bg-zinc-900 px-4! text-white hover:bg-zinc-800"
          >
            <CheckCheck size={16} className="mr-2" />
            Đọc hết
          </Button>
        </div>
      </div>

      <div className="mt-5 min-h-105">
        {isLoading ? (
          <div className="flex items-center justify-center h-105 text-zinc-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 text-center h-105">
            <div className="mb-3 flex h-12! w-12! items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
              <Bell size={22} />
            </div>

            <p className="font-semibold text-zinc-900">Chưa có thông báo</p>

            <p className="mt-1 text-sm! text-zinc-500">
              Khi có hoạt động mới, thông báo sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                role="button"
                tabIndex={0}
                onClick={() => handleMarkAsRead(notification)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleMarkAsRead(notification);
                  }
                }}
                className={`group flex cursor-pointer items-start justify-between gap-4 rounded-2xl px-5! py-4! transition ${
                  notification.isRead ? 'bg-white' : 'bg-red-50'
                } hover:bg-zinc-50`}
              >
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs! text-zinc-500">
                    <span className="font-medium text-zinc-700">
                      {notificationTypeLabel[notification.type] || 'Hệ thống'}
                    </span>

                    <span>•</span>

                    <span>{formatTime(notification.createdAt)}</span>

                    {!notification.isRead && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-red-600">
                          Chưa đọc
                        </span>
                      </>
                    )}
                  </div>

                  <p className="line-clamp-1 text-sm! font-semibold text-zinc-950">
                    {notification.title}
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm! leading-5 text-zinc-600">
                    {notification.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(event) => handleDelete(event, notification.id)}
                  className="shrink-0 rounded-lg p-2! text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col justify-between gap-3 text-sm! text-zinc-500 md:flex-row md:items-center">
        <p>
          Hiển thị {meta.itemCount} / {meta.totalItems} thông báo
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!canGoPrev || isLoading}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="h-9! rounded-xl px-4!"
          >
            Trước
          </Button>

          <span className="min-w-20 text-center text-sm! text-zinc-600">
            {meta.currentPage} / {meta.totalPages || 1}
          </span>

          <Button
            type="button"
            variant="outline"
            disabled={!canGoNext || isLoading}
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, meta.totalPages))
            }
            className="h-9! rounded-xl px-4!"
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminNotificationsPage;
