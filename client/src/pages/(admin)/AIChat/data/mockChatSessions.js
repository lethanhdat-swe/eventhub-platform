const mockChatSessions = [
  {
    id: 'session-1',
    guestId: null,
    user: {
      id: 'user-1',
      fullName: 'Le Thanh Dat',
      email: 'dat@example.com',
      avatarUrl: null,
    },
    updatedAtText: '10 minutes ago',
    unreadCount: 2,
    lastActiveText: 'Active 2 minutes ago',
    messages: [
      {
        id: 'msg-1-1',
        role: 'USER',
        content: 'Toi muon hoi cach hoan ve su kien.',
        createdAtText: '10:20',
      },
      {
        id: 'msg-1-2',
        role: 'ASSISTANT',
        content:
          'Beetic ho tro hoan ve theo chinh sach: truoc 3 ngay duoc hoan 100%, trong vong 3 ngay duoc hoan 50%, su kien da dien ra thi khong ho tro hoan ve.',
        createdAtText: '10:21',
        actions: [
          { type: 'OPEN_REFUND_FORM', label: 'Mo form hoan ve' },
          { type: 'VIEW_MY_ORDERS', label: 'Xem don hang' },
        ],
      },
      {
        id: 'msg-1-3',
        role: 'USER',
        content: 'Cam on, toi se kiem tra don hang ngay.',
        createdAtText: '10:22',
      },
    ],
  },
  {
    id: 'session-2',
    guestId: 'guest-a17f92c3',
    user: null,
    updatedAtText: '25 minutes ago',
    unreadCount: 0,
    lastActiveText: 'Active 20 minutes ago',
    messages: [
      {
        id: 'msg-2-1',
        role: 'SYSTEM',
        content: 'Guest started a conversation without login.',
        createdAtText: '09:57',
      },
      {
        id: 'msg-2-2',
        role: 'USER',
        content: 'Cho minh hoi su kien am nhac thu 7 con ve khong?',
        createdAtText: '09:58',
      },
      {
        id: 'msg-2-3',
        role: 'ASSISTANT',
        content:
          'Su kien van con ve o khu vuc Standard va VIP. Ban co the vao trang chi tiet su kien de dat cho nhanh.',
        createdAtText: '10:00',
        actions: [{ type: 'OPEN_EVENT_LIST', label: 'Xem danh sach su kien' }],
      },
    ],
  },
  {
    id: 'session-3',
    guestId: null,
    user: {
      id: 'user-2',
      fullName: 'Nguyen Minh Chau',
      email: 'chau.nguyen@example.com',
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
    },
    updatedAtText: '1 hour ago',
    unreadCount: 1,
    lastActiveText: 'Last active 1 hour ago',
    messages: [
      {
        id: 'msg-3-1',
        role: 'USER',
        content: 'Toi khong nhan duoc email xac nhan thanh toan.',
        createdAtText: '09:08',
      },
      {
        id: 'msg-3-2',
        role: 'ASSISTANT',
        content:
          'Ban vui long kiem tra thu muc Spam. Neu van khong co, hay gui ma don hang de he thong kiem tra lai.',
        createdAtText: '09:09',
      },
      {
        id: 'msg-3-3',
        role: 'USER',
        content: 'Ma don hang cua toi la EV-672189.',
        createdAtText: '09:10',
      },
    ],
  },
  {
    id: 'session-4',
    guestId: null,
    user: {
      id: 'user-3',
      fullName: 'Tran Bao An',
      email: 'an.tran@example.com',
      avatarUrl: null,
    },
    updatedAtText: '2 hours ago',
    unreadCount: 0,
    lastActiveText: 'Last active 2 hours ago',
    messages: [
      {
        id: 'msg-4-1',
        role: 'USER',
        content: 'Tai sao toi bi tu choi check-in?',
        createdAtText: '08:16',
      },
      {
        id: 'msg-4-2',
        role: 'ASSISTANT',
        content:
          'He thong bao ve da su dung hoac QR khong hop le. Ban co the mo ve cua toi de tao lai QR moi.',
        createdAtText: '08:17',
        actions: [{ type: 'OPEN_MY_TICKETS', label: 'Mo ve cua toi' }],
      },
    ],
  },
  {
    id: 'session-5',
    guestId: 'guest-e319ac77',
    user: null,
    updatedAtText: 'Yesterday',
    unreadCount: 0,
    lastActiveText: 'Last active yesterday',
    messages: [
      {
        id: 'msg-5-1',
        role: 'USER',
        content: 'Minh co the thanh toan bang ma QR khong?',
        createdAtText: '18:42',
      },
      {
        id: 'msg-5-2',
        role: 'ASSISTANT',
        content: 'Ban co the thanh toan qua QR o buoc thanh toan, he thong se tao ma ngay lap tuc.',
        createdAtText: '18:43',
      },
    ],
  },
  {
    id: 'session-6',
    guestId: null,
    user: {
      id: 'user-4',
      fullName: 'Pham Hai Dang',
      email: 'dang.pham@example.com',
      avatarUrl: 'https://i.pravatar.cc/100?img=5',
    },
    updatedAtText: 'Yesterday',
    unreadCount: 3,
    lastActiveText: 'Last active yesterday',
    messages: [
      {
        id: 'msg-6-1',
        role: 'USER',
        content: 'Toi muon doi ghe tu B12 sang B09.',
        createdAtText: '15:21',
      },
      {
        id: 'msg-6-2',
        role: 'ASSISTANT',
        content:
          'Ban co the doi ghe neu su kien cho phep va ghe moi chua co nguoi dat. Vui long vao trang don hang de doi ghe.',
        createdAtText: '15:22',
        actions: [{ type: 'OPEN_ORDER_DETAIL', label: 'Mo chi tiet don hang' }],
      },
    ],
  },
  {
    id: 'session-7',
    guestId: null,
    user: {
      id: 'user-5',
      fullName: 'Hoang Thi Linh',
      email: 'linh.hoang@example.com',
      avatarUrl: null,
    },
    updatedAtText: '2 days ago',
    unreadCount: 0,
    lastActiveText: 'Last active 2 days ago',
    messages: [
      {
        id: 'msg-7-1',
        role: 'USER',
        content: 'Toi da thanh toan 2 lan cho cung mot don, can ho tro.',
        createdAtText: '11:14',
      },
      {
        id: 'msg-7-2',
        role: 'ASSISTANT',
        content:
          'Neu bi trung giao dich, he thong se doi soat va hoan tien tu dong trong 3-5 ngay lam viec.',
        createdAtText: '11:15',
        actions: [
          { type: 'VIEW_PAYMENT_STATUS', label: 'Kiem tra trang thai thanh toan' },
          { type: 'OPEN_SUPPORT_TICKET', label: 'Tao yeu cau ho tro' },
        ],
      },
    ],
  },
  {
    id: 'session-8',
    guestId: 'guest-z9982dc2',
    user: null,
    updatedAtText: '3 days ago',
    unreadCount: 0,
    lastActiveText: 'Last active 3 days ago',
    messages: [
      {
        id: 'msg-8-1',
        role: 'USER',
        content: 'Ban oi cho hoi su kien cho phep mang tre em vao khong?',
        createdAtText: '09:05',
      },
      {
        id: 'msg-8-2',
        role: 'ASSISTANT',
        content:
          'Moi su kien co quy dinh khac nhau. Ban hay kiem tra muc thong tin su kien, phan Luu y truoc khi dat ve.',
        createdAtText: '09:06',
      },
    ],
  },
];

export default mockChatSessions;
