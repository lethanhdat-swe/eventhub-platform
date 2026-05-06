import { images } from '@/assets';

export const events = [
  {
    id: 1,
    date: {
      day: '25', month: 'MAY', year: '2026', weekday: 'Sat',
      time: '19:00', period: 'PM', fullTime: '7:00 PM - 2:00 AM',
    },
    image: images.avatar1,
    tag: 'CONCERT',
    title: 'Martin Garrix Live in Bangkok 2024',
    subtitle: 'The biggest EDM event of the year! Top DJs, insane production.',
    location: 'Impact Arena, Bangkok',
    price: 89000,
    rating: 4.8,
    reviewCount: 1250,
    desc: 'Trải nghiệm đêm nhạc EDM bùng nổ cùng DJ số 1 thế giới Martin Garrix với hệ thống âm thanh ánh sáng đẳng cấp quốc tế.',
    organizer: {
      name: 'BeatZone Events',
      avatar: images.organizer1,
      bio: 'Leading event organizer bringing the best music experiences to life.'
    },
    hotline: '+1 (323) 555-7890',
    ticketTypes: [
      { name: 'General Admission', price: 89000, label: { text: 'Còn vé', variant: 'success' }, stock: 120 },
      { name: 'VIP Admission', price: 159000, label: { text: 'Sắp hết', variant: 'warning' }, stock: 8 },
      { name: 'VVIP Admission', price: 249000, label: { text: 'Hết vé', variant: 'error' }, stock: 0 }
    ],
    features: ['18+ Event', 'Experience 3 Stages', 'Food & Drinks', 'VIP Lounge']
  },
  {
    id: 2,
    date: {
      day: '08', month: 'JUN', year: '2026', weekday: 'Sat',
      time: '16:00', period: 'PM', fullTime: '4:00 PM - 11:00 PM',
    },
    image: images.avatar2,
    tag: 'FESTIVAL',
    title: 'Summer Vibes Music Festival',
    subtitle: 'Feel the ocean breeze and the rhythm of summer nights.',
    location: 'Ocean Park, Miami',
    price: 129000,
    rating: 4.5,
    reviewCount: 840,
    desc: 'Lễ hội âm nhạc bãi biển lớn nhất mùa hè với sự góp mặt của nhiều nghệ sĩ indie và pop nổi tiếng toàn cầu.',
    organizer: {
      name: 'Miami Sound Collective',
      avatar: images.organizer2,
      bio: 'Creating unforgettable summer memories through music.'
    },
    hotline: '+1 (786) 222-1111',
    ticketTypes: [
      { name: 'Early Bird', price: 99000, label: { text: 'Hết vé', variant: 'error' }, stock: 0 },
      { name: 'Standard Pass', price: 129000, label: { text: 'Còn vé', variant: 'success' }, stock: 450 }
    ],
    features: ['All Ages', 'Beach Stage', 'Fireworks', 'Free Parking']
  },
  {
    id: 3,
    date: {
      day: '15', month: 'JUN', year: '2026', weekday: 'Mon',
      time: '09:00', period: 'AM', fullTime: '9:00 AM - 6:00 PM',
    },
    image: images.avatar3,
    tag: 'ART',
    title: 'Van Gogh Immersive Experience',
    subtitle: 'Step into a world of light and color with 360-degree digital art.',
    location: 'Arts Center, Singapore',
    price: 45000,
    rating: 4.9,
    reviewCount: 3200,
    desc: 'Triển lãm nghệ thuật đa giác quan đưa bạn đắm chìm trong những tác phẩm kinh điển của Vincent van Gogh.',
    organizer: {
      name: 'Global Art Exhibits',
      avatar: images.organizer3,
      bio: 'Bringing digital masterpieces to the worlds finest galleries.'
    },
    hotline: '+65 6789 0123',
    ticketTypes: [
      { name: 'Standard', price: 45000, label: { text: 'Còn vé', variant: 'success' }, stock: 85 },
      { name: 'Student', price: 35000, label: { text: 'Còn vé', variant: 'success' }, stock: 20 }
    ],
    features: ['Guided Tour', 'Photo Zone', 'Souvenir Shop']
  },
  {
    id: 4,
    date: {
      day: '20', month: 'JUN', year: '2026', weekday: 'Sat',
      time: '18:00', period: 'PM', fullTime: '6:00 PM - 11:30 PM',
    },
    image: images.avatar4,
    tag: 'ROCK',
    title: 'Rock Storm: The Legacy',
    subtitle: 'The heavy metal night that will shake the city ground.',
    location: 'My Dinh Stadium, Hanoi',
    price: 55000,
    rating: 4.7,
    reviewCount: 950,
    desc: 'Đêm nhạc Rock lớn nhất năm tại Hà Nội với sự góp mặt của các ban nhạc huyền thoại.',
    organizer: {
      name: 'V-Rock Production',
      avatar: images.organizer4,
      bio: 'The home of Vietnamese Rock and Heavy Metal enthusiasts.'
    },
    hotline: '+84 901 234 567',
    ticketTypes: [
      { name: 'Pit Section', price: 75000, label: { text: 'Sắp hết', variant: 'warning' }, stock: 15 },
      { name: 'Grandstand', price: 55000, label: { text: 'Còn vé', variant: 'success' }, stock: 200 }
    ],
    features: ['Beer Garden', 'Merchandise', 'Free Water']
  },
  {
    id: 5,
    date: {
      day: '05', month: 'JUL', year: '2026', weekday: 'Sun',
      time: '19:30', period: 'PM', fullTime: '7:30 PM - 10:00 PM',
    },
    image: images.avatar5,
    tag: 'K-POP',
    title: 'BLACKPINK World Tour [BORN PINK]',
    subtitle: 'The pink ocean is returning to Tokyo Dome!',
    location: 'Tokyo Dome, Japan',
    price: 350000,
    rating: 5.0,
    reviewCount: 15400,
    desc: 'Chuyến lưu diễn vòng quanh thế giới của nhóm nhạc nữ số 1 thế giới.',
    organizer: {
      name: 'YG Entertainment',
      avatar: images.organizer5,
      bio: 'Leading Korean entertainment global brand.'
    },
    hotline: '+81 3-1234-5678',
    ticketTypes: [
      { name: 'Platinum', price: 450000, label: { text: 'Hết vé', variant: 'error' }, stock: 0 },
      { name: 'Gold', price: 350000, label: { text: 'Sắp hết', variant: 'warning' }, stock: 2 }
    ],
    features: ['Lightstick Support', 'Official Merch', 'Fanzone']
  },
  {
    id: 6,
    date: {
      day: '12', month: 'JUL', year: '2026', weekday: 'Sun',
      time: '14:00', period: 'PM', fullTime: '2:00 PM - 5:00 PM',
    },
    image: images.avatar2,
    tag: 'WORKSHOP',
    title: 'Barista Masterclass: Latte Art',
    subtitle: 'Learn the secrets behind the perfect cup of coffee.',
    location: 'The Coffee House HQ, HCM City',
    price: 120000,
    rating: 4.6,
    reviewCount: 180,
    desc: 'Khóa học ngắn hạn dành cho những người yêu cà phê được hướng dẫn trực tiếp bởi chuyên gia.',
    organizer: {
      name: 'Coffee Academy',
      avatar: images.organizer6,
      bio: 'Training the next generation of world-class baristas.'
    },
    hotline: '1800 6936',
    ticketTypes: [
      { name: 'Single Entry', price: 120000, label: { text: 'Còn vé', variant: 'success' }, stock: 10 }
    ],
    features: ['Certificate', 'Free Materials', 'Tasting']
  },
  {
    id: 7,
    date: {
      day: '30', month: 'JUL', year: '2026', weekday: 'Thu',
      time: '20:00', period: 'PM', fullTime: '8:00 PM - 11:00 PM',
    },
    image: images.avatar3,
    tag: 'COMEDY',
    title: 'Late Night Laughs with Kevin Hart',
    subtitle: 'An evening of non-stop laughter with the comedy legend.',
    location: 'The O2 Arena, London',
    price: 180000,
    rating: 4.8,
    reviewCount: 4200,
    desc: 'Đứng ngồi không yên với những câu chuyện hài hước từ ngôi sao Hollywood Kevin Hart.',
    organizer: {
      name: 'Funny Bone Pro',
      avatar: images.organizer7,
      bio: 'Touring the worlds biggest stand-up comedy stars.'
    },
    hotline: '+44 20 7999 1234',
    ticketTypes: [
      { name: 'Front Row', price: 280000, label: { text: 'Còn vé', variant: 'success' }, stock: 5 },
      { name: 'Standard Seat', price: 180000, label: { text: 'Còn vé', variant: 'success' }, stock: 150 }
    ],
    features: ['16+ Only', 'No Flash Photography', 'Bar Access']
  },
  {
    id: 8,
    date: {
      day: '15', month: 'AUG', year: '2026', weekday: 'Sat',
      time: '10:00', period: 'AM', fullTime: '10:00 AM - 10:00 PM',
    },
    image: images.avatar5,
    tag: 'ANIME',
    title: 'Anime Expo 2026',
    subtitle: 'Celebrate the world of Japanese animation and culture.',
    location: 'Convention Center, Los Angeles',
    price: 65000,
    rating: 4.7,
    reviewCount: 8900,
    desc: 'Sự kiện lớn nhất dành cho cộng đồng yêu thích Anime và Manga.',
    organizer: {
      name: 'Otaku Connect',
      avatar: images.organizer8,
      bio: 'The global community hub for anime, manga, and gaming.'
    },
    hotline: '+1 (213) 555-0199',
    ticketTypes: [
      { name: '1-Day Pass', price: 65000, label: { text: 'Còn vé', variant: 'success' }, stock: 1000 },
      { name: 'VVIP Pass', price: 250000, label: { text: 'Sắp hết', variant: 'warning' }, stock: 12 }
    ],
    features: ['Cosplay Contest', 'Exclusive Merch', 'Gaming Zone']
  },
  {
    id: 9,
    date: {
      day: '02', month: 'SEP', year: '2026', weekday: 'Wed',
      time: '18:00', period: 'PM', fullTime: '6:00 PM - 9:00 PM',
    },
    image: images.avatar1,
    tag: 'SPORTS',
    title: 'NBA Global Games 2026',
    subtitle: 'Witness the elite basketball action live on court.',
    location: 'Accor Arena, Paris',
    price: 520000,
    rating: 4.9,
    reviewCount: 3500,
    desc: 'Trận đấu kịch tính giữa các đội bóng hàng đầu giải NBA ngay tại trung tâm Paris.',
    organizer: {
      name: 'NBA International',
      avatar: images.organizer9,
      bio: 'Promoting the spirit of professional basketball worldwide.'
    },
    hotline: '+33 1 23 45 67 89',
    ticketTypes: [
      { name: 'Courtside', price: 1500000, label: { text: 'Hết vé', variant: 'error' }, stock: 0 },
      { name: 'Category 1', price: 520000, label: { text: 'Còn vé', variant: 'success' }, stock: 45 }
    ],
    features: ['Half-time Show', 'Interactive Games', 'Player Meetup']
  }
];
export const eventData = {
  events: events,
  pagination: {
    totalItems: events.length,
    itemsPerPage: 6,
    currentPage: 1,
    totalPages: Math.ceil(events.length / 6),
    hasNextPage: true,
    hasPrevPage: false,
  },
};
