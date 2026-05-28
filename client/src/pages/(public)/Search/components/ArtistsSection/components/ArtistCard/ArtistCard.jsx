import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { UserRound } from 'lucide-react';

function ArtistCard({ artist }) {
  return (
    <div className="group block overflow-hidden rounded-3xl border border-(--border-color) bg-(--card-surface-color) p-5 shadow-[0_14px_40px_rgba(9,9,11,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-(--primary-color)/40 hover:bg-(--card-hover-color) hover:shadow-[0_18px_50px_rgba(9,9,11,0.12)]">
      <div className="relative flex flex-col items-center text-center">
        <div className="absolute top-4 h-24 w-24 rounded-full bg-(--primary-color)/20 blur-2xl transition-all duration-300 group-hover:bg-(--primary-color)/30" />

        <div className="relative mb-4 rounded-full border border-(--border-color) bg-(--soft-surface-color) p-1 shadow-sm">
          <img
            src={resolvePublicAssetUrl(artist.avatarUrl)}
            alt={artist.name}
            className="h-24 w-24 rounded-full border border-(--border-color) object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="line-clamp-1 text-lg font-bold text-(--text-primary)">
          {artist.name}
        </h3>

        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1 text-xs font-semibold text-(--muted-text)">
          <UserRound size={13} />
          Nghệ sĩ
        </div>
      </div>
    </div>
  );
}

export default ArtistCard;
