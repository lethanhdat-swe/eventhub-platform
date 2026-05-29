import RichContentRenderer from '@/components/RichContentRenderer/RichContentRenderer';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { Sparkles, UserRound } from 'lucide-react';

function EventAbout({ event }) {
  const artists = event.eventArtists ?? [];

  return (
    <section className="max-w-full min-w-0 py-3">
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-(--border-color) pb-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-(--primary-color)">
            <Sparkles size={15} />
            Thông tin sự kiện
          </p>

          <h2 className="text-2xl font-black tracking-tight text-(--text-primary)">
            Giới thiệu sự kiện
          </h2>
        </div>
      </div>

      {event.contentHtml ? (
        <div className="min-w-0 max-w-full overflow-hidden text-(--text-primary) **:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto [&_img]:h-auto">
          <RichContentRenderer html={event.contentHtml} />
        </div>
      ) : (
        <p className="text-sm text-(--muted-text)">
          Nội dung giới thiệu sự kiện đang được cập nhật.
        </p>
      )}

      {artists.length > 0 && (
        <div className="mt-8 border-t border-(--border-color) pt-7">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-(--primary-color)">
                <UserRound size={15} />
                Line-up
              </p>

              <h3 className="text-2xl font-black tracking-tight text-(--text-primary)">
                Nghệ sĩ tham gia
              </h3>
            </div>

            <span className="rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs font-bold text-(--muted-text)">
              {artists.length} nghệ sĩ
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {artists.map((item, index) => {
              const artist = item.artist;
              const name = artist?.name || 'Đang cập nhật';
              const avatarUrl = resolvePublicAssetUrl(artist?.avatarUrl);

              return (
                <div
                  key={artist?.id ?? index}
                  className="group relative aspect-[5/5] overflow-hidden rounded-3xl border border-(--border-color) bg-(--soft-surface-color)"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-(--primary-color)/15 text-4xl font-black text-(--primary-color)">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="mb-2 inline-flex rounded-full bg-(--primary-color) px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                      {item.role || 'ARTIST'}
                    </span>

                    <h4 className="text-lg font-black leading-tight text-white line-clamp-2">
                      {name}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default EventAbout;