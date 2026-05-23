function EventAbout({ event }) {
  return (
    <div className="p-4 border-t-2 border-(--text-primary)/30">
      <div>
        <h1 className="text-(--text-primary) text-xl">
          About This Event
        </h1>

        {event.contentHtml && (
          <div
            className="pt-4 text-(--text-primary)/60 space-y-2"
            dangerouslySetInnerHTML={{
              __html: event.contentHtml,
            }}
          />
        )}
      </div>

      {event.eventArtists?.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {event.eventArtists.map((artist, index) => (
            <span
              key={index}
              className="bg-gray-500/20 rounded-xl text-(--text-primary) px-4 py-2"
            >
              {artist.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventAbout;