import RichContentRenderer from '@/components/RichContentRenderer/RichContentRenderer';

function EventAbout({ event }) {
  return (
    <div className="p-3 border-t border-(--text-primary)/20">
      <div>
        <h1 className="text-(--text-primary) text-lg font-medium">
          About This Event
        </h1>

        {event.contentHtml && <RichContentRenderer html={event.contentHtml} />}
      </div>

      {event.eventArtists?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {event.eventArtists.map((artist, index) => (
            <span
              key={index}
              className="bg-gray-500/20 rounded-lg text-(--text-primary) px-3 py-1.5 text-sm"
            >
              {artist.artist?.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventAbout;
