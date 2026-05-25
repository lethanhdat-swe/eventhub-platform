import {
  Armchair,
  CalendarDays,
  ClipboardList,
  Contact,
  FileText,
  FolderTree,
  LayoutDashboard,
  Mic2,
  Percent,
  Receipt,
  ReceiptText,
  ScanLine,
  Settings,
  ShoppingCart,
  Tags,
  Ticket,
  Users,
} from 'lucide-react';

export const adminNavSections = [
  {
    title: 'Tổng quan',
    items: [
      {
        label: 'Bảng điều khiển',
        to: '/admin/dashboard',
        icon: LayoutDashboard,
        match: 'exact',
      },
    ],
  },
  {
    title: 'Quản lý sự kiện',
    items: [
      {
        label: 'Sự kiện',
        to: '/admin/events',
        icon: CalendarDays,
        match: 'prefix',
      },
      {
        label: 'Danh mục sự kiện',
        to: '/admin/event-categories',
        icon: Tags,
        match: 'exact',
      },
      {
        label: 'Nghệ sĩ',
        to: '/admin/artists',
        icon: Mic2,
        match: 'exact',
      },
      {
        label: 'Ghế ngồi mặc định',
        to: '/admin/default-seats',
        icon: Armchair,
        match: 'exact',
      },
    ],
  },
  {
    title: 'Vé & đơn hàng',
    items: [
      {
        label: 'Loại vé',
        to: '/admin/ticket-types',
        icon: Ticket,
        match: 'exact',
      },
      {
        label: 'Đơn hàng',
        to: '/admin/orders',
        icon: ShoppingCart,
        match: 'exact',
      },
      {
        label: 'Đối soát thanh toán',
        to: '/admin/payment-transactions',
        icon: ReceiptText,
        match: 'exact',
      },
      {
        label: 'Vé đã đặt',
        to: '/admin/tickets',
        icon: Receipt,
        match: 'exact',
      },
      {
        label: 'Mã giảm giá',
        to: '/admin/coupons',
        icon: Percent,
        match: 'exact',
      },
    ],
  },
  {
    title: 'Check-in',
    items: [
      {
        label: 'Quét mã check-in',
        to: '/admin/check-in',
        icon: ScanLine,
        match: 'exact',
      },
      {
        label: 'Lịch sử check-in',
        to: '/admin/check-in-logs',
        icon: ClipboardList,
        match: 'exact',
      },
    ],
  },
  {
    title: 'Nội dung',
    items: [
      {
        label: 'Quản lý bài viết',
        to: '/admin/blogs',
        icon: FileText,
        match: 'prefix',
      },
      {
        label: 'Quản lý danh mục blog',
        to: '/admin/blog-categories',
        icon: FolderTree,
        match: 'exact',
      },
    ],
  },
  {
    title: 'Liên hệ',
    items: [
      {
        label: 'Quản lý liên hệ',
        to: '/admin/contact',
        icon: Contact,
        match: 'exact',
      },
    ],
  },
  {
    title: 'Người dùng',
    items: [
      {
        label: 'Danh sách người dùng',
        to: '/admin/users',
        icon: Users,
        match: 'exact',
      },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      {
        label: 'Cấu hình hệ thống',
        to: '/admin/settings',
        icon: Settings,
        match: 'exact',
      },
    ],
  },
];

export function isNavItemActive(pathname, item) {
  if (item.match === 'prefix') {
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  }

  return pathname === item.to;
}

export function getAdminBreadcrumbs(pathname) {
  if (pathname === '/admin/dashboard') {
    return [{ label: 'Bảng điều khiển' }];
  }

  if (pathname === '/admin/events') {
    return [{ label: 'Sự kiện' }];
  }

  if (pathname === '/admin/events/create') {
    return [{ label: 'Sự kiện' }, { label: 'Tạo mới' }];
  }

  const eventEditMatch = pathname.match(/^\/admin\/events\/([^/]+)\/edit$/);
  if (eventEditMatch) {
    return [{ label: 'Sự kiện' }, { label: 'Chỉnh sửa' }];
  }

  const eventDetailMatch = pathname.match(/^\/admin\/events\/([^/]+)$/);
  if (eventDetailMatch) {
    return [{ label: 'Sự kiện' }, { label: 'Chi tiết' }];
  }

  if (pathname === '/admin/blogs') {
    return [{ label: 'Nội dung' }, { label: 'Quản lý bài viết' }];
  }

  if (pathname === '/admin/blogs/create') {
    return [{ label: 'Nội dung' }, { label: 'Quản lý bài viết' }, { label: 'Tạo mới' }];
  }

  const blogEditMatch = pathname.match(/^\/admin\/blogs\/([^/]+)\/edit$/);
  if (blogEditMatch) {
    return [{ label: 'Nội dung' }, { label: 'Quản lý bài viết' }, { label: 'Chỉnh sửa' }];
  }

  if (pathname === '/admin/blog-categories') {
    return [{ label: 'Nội dung' }, { label: 'Quản lý danh mục blog' }];
  }

  if (pathname === '/admin/contact') {
    return [{ label: 'Liên hệ' }, { label: 'Quản lý liên hệ' }];
  }

  for (const section of adminNavSections) {
    for (const item of section.items) {
      if (pathname === item.to) {
        return [{ label: item.label }];
      }
    }
  }

  return [{ label: 'Quản trị' }];
}
