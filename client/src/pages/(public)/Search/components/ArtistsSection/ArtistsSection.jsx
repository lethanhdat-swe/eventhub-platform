import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import ArtistCard from "./components/ArtistCard/ArtistCard";
import { searchService } from "@/lib/services/search";

function ArtistsSection({ keyword }) {
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
            setIsLoading(true)
            const fetchData = async () => {
                const res = await searchService.search(keyword);
                setArtists(res.artists)
            };
            fetchData();
            setIsLoading(false)
    }, [keyword]);

    return ( 
        <div className="container my-10 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Star color="var(--primary-color)"/>
                    <p className="text-(--text-primary) text-xl">Artists</p> 
                </div>

               <div className="flex items-center gap-1">
                    <Link to={'/events'} className="text-(--primary-color)">
                        View All Artists
                    </Link>
                    <ArrowRight color="var(--primary-color)" />
                </div>
            </div>

            {isLoading && (
                <div className="mt-5 text-center text-(--text-primary) text-xl">
                    <p>Loading artists...</p>
                </div>
            )}

            {!isLoading && artists.length === 0 && keyword && (
                <div className="mt-5 text-center text-(--text-primary) text-xl">
                    <p>No artists found for &quot;{keyword}&quot;</p>
                </div>
            )}

            {artists.length > 0 && (
                <div className="grid grid-cols-12 gap-5 mt-5">
                    {artists.map((artist) => (
                         <div key={artist.id} className="col-span-3">
                            <ArtistCard artist={artist}/>
                         </div>
                    ))}
                </div>
            )}
        </div>
     );
}

export default ArtistsSection;