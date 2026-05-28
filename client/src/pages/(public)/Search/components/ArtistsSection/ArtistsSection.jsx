import { useEffect, useState } from 'react';
import { ArrowRight, SearchX, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArtistCard from './components/ArtistCard/ArtistCard';
import { searchService } from '@/lib/services/search';

function ArtistsSection({ keyword }) {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res = await searchService.search(keyword);

        if (isMounted) {
          setArtists(res?.artists || []);
        }
      } catch (error) {
        console.error('Failed to search artists:', error);

        if (isMounted) {
          setArtists([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [keyword]);

  return (
    <section className="container my-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
            <Star size={20} />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-(--text-primary)">
              Nghệ sĩ
            </h2>

            <p className="mt-1 text-sm text-(--muted-text)">
              Tìm thấy {artists.length} nghệ sĩ
              {keyword ? ` cho "${keyword}"` : ''}
            </p>
          </div>
        </div>

        <Link
          to="/artists"
          className="group hidden items-center gap-2 rounded-full border border-(--border-color) bg-(--soft-surface-color) px-4 py-2 text-sm font-semibold text-(--primary-color) transition-all duration-300 hover:border-(--primary-color)/40 hover:bg-(--primary-color)/10 md:flex"
        >
          Xem tất cả
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[320px] animate-pulse rounded-3xl border border-(--border-color) bg-(--soft-surface-color)"
            />
          ))}
        </div>
      )}

      {!isLoading && artists.length === 0 && keyword && (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-dashed border-(--border-color) bg-(--soft-surface-color) px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
            <SearchX size={26} />
          </div>

          <h3 className="text-xl font-black text-(--text-primary)">
            Không tìm thấy nghệ sĩ
          </h3>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-(--muted-text)">
            Không có nghệ sĩ nào phù hợp với từ khóa &quot;{keyword}&quot;. Hãy
            thử tìm kiếm bằng từ khóa khác.
          </p>
        </div>
      )}

      {!isLoading && artists.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ArtistsSection;
