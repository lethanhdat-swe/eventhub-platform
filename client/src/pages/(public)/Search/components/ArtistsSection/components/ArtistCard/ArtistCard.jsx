function ArtistCard({artist}) {
    return ( 
        <div
            key={artist.id}
            className="p-5 border rounded-3xl border-(--text-primary)/10 bg-(--text-primary)/5 backdrop-blur-xl"
            >
            <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 rounded-full bg-(--primary-color)/30 blur-xl" />

                <img
                src={artist.image}
                alt={artist.name}
                className="relative object-cover w-24 h-24 border rounded-full border-(--primary-color)/40"
                />

                <h3 className="text-lg font-semibold text-(--text-primary)">
                    {artist.name}
                </h3>

                <p className="text-sm text-(--text-primary)/60">
                    {artist.genre}
                </p>

                <p className="mt-1 text-sm text-(--text-primary)/40">
                    {artist.followers}
                </p>
            </div>


            <button
                className="
                mt-5 w-full rounded-xl
                border border-(--primary-color)/30
                bg-(--primary-color)/10
                py-2 text-sm text-(--primary-color)
                transition-all duration-300
                hover:bg-(--primary-color) hover:text-(--text-primary)
                hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
                "
            >
                Follow
            </button>
        </div>
     );
}

export default ArtistCard;