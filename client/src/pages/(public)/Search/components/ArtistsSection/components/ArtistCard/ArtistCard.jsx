import { resolvePublicAssetUrl } from "@/lib/url/resolvePublicAssetUrl";

function ArtistCard({artist}) {

    console.log('artist: ',artist)

    return ( 
        <div
            key={artist.id}
            className="p-5 border rounded-3xl border-(--text-primary)/10 bg-(--text-primary)/5 backdrop-blur-xl"
            >
            <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 rounded-full bg-(--primary-color)/30 blur-xl" />

                <img
                    src={resolvePublicAssetUrl(artist.avatarUrl)}
                    alt={artist.name}
                className="relative object-cover w-24 h-24 border rounded-full border-(--primary-color)/40"
                />

                <h3 className="text-lg font-semibold text-(--text-primary)">
                    {artist.name}
                </h3>
            </div>
        </div>
     );
}

export default ArtistCard;