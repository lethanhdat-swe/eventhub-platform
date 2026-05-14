import { artists } from "@/pages/(public)/Search/components/ArtistsSection/data";

function EventLineup() {
    return ( 
        <div>
          <p className="text-(--text-primary) text-xl uppercase font-semibold tracking-wider">
            Danh sách trình diễn
          </p>
          <div className="flex gap-10">
            {artists.map((artist, i) => (
              <div
                key={artist.id}
                className="flex flex-col items-center mt-5 cursor-pointer group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="rounded-3xl overflow-hidden ring-2 ring-transparent group-hover:ring-(--primary-color)/50 transition-all duration-300 group-hover:scale-105 w-25 h-25">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col items-center mt-2">
                  <p className="text-(--text-primary) group-hover:text-(--primary-color) transition-colors duration-200">
                    {artist.name}
                  </p>
                  <p className="text-(--text-primary)/70 text-[14px]">{artist.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
     );
}

export default EventLineup;