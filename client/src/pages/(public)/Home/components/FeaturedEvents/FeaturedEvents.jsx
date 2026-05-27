import PublicEventCard from '@/pages/(public)/components/PublicEventCard/PublicEventCard';
import { ArrowRight, CalendarHeart } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockEvents = [
  {
    id: '06f75544-f0b0-42ba-852b-11dc6351a989',
    title: 'Joji Tour',
    slug: 'joji-tour',
    description: 'Joji Tour',
    contentHtml: '<p>Joji Tour</p>',
    location: 'Tập đoàn 16, Quốc lộ 50',
    startDate: '2026-05-23T07:10:00.000Z',
    endDate: '2026-05-25T07:10:00.000Z',
    thumbnailUrl: '1779520249810-57f3bed3dd05ae24.png',
    status: 'PUBLISHED',
    category: {
      id: 'f4f93178-5a3c-4a55-a8bd-d95ab9550cd0',
      name: 'Nước ngoài',
    },
    eventArtists: [
      {
        role: 'SINGER',
        artist: {
          id: '2b9f7896-cfb1-4f79-bbc9-d5f8e3983a9a',
          name: 'Dat-Lee',
          slug: 'dat-lee',
          avatarUrl: '/uploads/1779524464243-c52244027dbc4299.png',
        },
      },
      {
        role: 'DJ',
        artist: {
          id: '3118b07c-6d48-4618-838d-d64a2072756a',
          name: 'JD Le Dat',
          slug: 'jd-le-dat',
          avatarUrl: '/uploads/1779524475038-bb106647410bd837.png',
        },
      },
      {
        role: 'SINGER',
        artist: {
          id: '388945b5-8325-4524-8c10-d08ff8bbeca7',
          name: 'Ca sĩ Dat Lee',
          slug: 'ca-si-dat-lee',
          avatarUrl: '/uploads/1779524484041-867cb57928c652b6.jpg',
        },
      },
    ],
  },
  {
    id: 'ff285928-c70c-4de7-99b9-5379916f1d34',
    title: 'Dat Lee Live Concert',
    slug: 'dat-lee',
    description: 'Dat Lee',
    contentHtml: '<p>Dat Lee</p>',
    location: 'Nhà hát Thành phố Hồ Chí Minh',
    startDate: '2026-05-24T09:29:00.000Z',
    endDate: '2026-05-28T09:30:00.000Z',
    thumbnailUrl: '1779615006336-c0ecdcd110da9ca5.png',
    status: 'PUBLISHED',
    category: {
      id: 'f4f93178-5a3c-4a55-a8bd-d95ab9550cd0',
      name: 'Âm nhạc',
    },
    eventArtists: [
      {
        role: 'SINGER',
        artist: {
          id: '3118b07c-6d48-4618-838d-d64a2072756a',
          name: 'JD Le Dat',
          slug: 'jd-le-dat',
          avatarUrl: '/uploads/1779524475038-bb106647410bd837.png',
        },
      },
    ],
  },
  {
    id: '86bd4e12-16dd-4a1d-a9ce-d71c5a790123',
    title: 'Summer Music Festival 2026',
    slug: 'summer-music-festival-2026',
    description: 'Summer Music Festival',
    contentHtml: '<p>Summer Music Festival</p>',
    location: 'Sân vận động Mỹ Đình, Hà Nội',
    startDate: '2026-06-12T12:00:00.000Z',
    endDate: '2026-06-12T16:30:00.000Z',
    thumbnailUrl: '1779520249810-57f3bed3dd05ae24.png',
    status: 'PUBLISHED',
    category: {
      id: 'cat-002',
      name: 'Lễ hội',
    },
    eventArtists: [
      {
        role: 'SINGER',
        artist: {
          id: 'artist-001',
          name: 'Summer Band',
          slug: 'summer-band',
          avatarUrl: '/uploads/1779524464243-c52244027dbc4299.png',
        },
      },
      {
        role: 'DJ',
        artist: {
          id: 'artist-002',
          name: 'DJ Night',
          slug: 'dj-night',
          avatarUrl: '/uploads/1779524484041-867cb57928c652b6.jpg',
        },
      },
    ],
  },
];

function FeaturedEvents() {
  const events = mockEvents;

  if (!events.length) return null;

  return (
    <section className="container mt-16">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
            <CalendarHeart size={23} />
          </div>

          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.24em] text-(--primary-color)">
              Sự kiện nổi bật
            </p>

            <h2 className="text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl">
              Những sự kiện đáng chú ý
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-(--text-primary)/55">
              Khám phá các sự kiện đang được mở bán và nhận được nhiều sự quan
              tâm.
            </p>
          </div>
        </div>

        <Link
          to="/events"
          className="group hidden items-center gap-2 rounded-full border border-(--text-primary)/10 bg-(--surface-color) px-5 py-2.5 text-sm font-bold text-(--text-primary)/80 shadow-sm transition hover:border-(--primary-color)/40 hover:text-(--primary-color) sm:flex"
        >
          Xem tất cả
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <PublicEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedEvents;
