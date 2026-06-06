import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function EventLineup({ eventArtists = [] }) {
    const artists = eventArtists
        .map((item) => ({
            id: item.artist?.id,
            name: item.artist?.name,
            image: resolvePublicAssetUrl(item.artist?.avatarUrl),
            role: item.role,
        }))
        .filter((artist) => artist.id);

    if (artists.length === 0) {
        return null;
    }

    return ( 
        <div>
          <p className="text-(--text-primary) text-lg uppercase font-semibold tracking-wider">
            Danh sách trình diễn
          </p>
          <div className="flex flex-wrap gap-6">
            {artists.map((artist, i) => (
              <div
                key={artist.id}
                className="flex flex-col items-center mt-4 cursor-pointer group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="rounded-2xl overflow-hidden ring-2 ring-transparent group-hover:ring-(--primary-color)/50 transition-all duration-300 group-hover:scale-105 size-20">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="object-cover w-full h-full bg-(--surface-color)"
                  />
                </div>
                <div className="flex flex-col items-center mt-2">
                  <p className="max-w-20 truncate text-center text-(--text-primary) transition-colors duration-200 group-hover:text-(--primary-color)">
                    {artist.name}
                  </p>
                  <p className="max-w-20 truncate text-center text-[14px] text-(--text-primary)/70">{artist.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
     );
}

export default EventLineup;