import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import ArtistCard from "./components/ArtistCard/ArtistCard";
import { searchService } from "@/lib/services/searchService";

function ArtistsSection({ keyword }) {
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Transform API data to match ArtistCard component format
    const transformArtistData = (apiArtist) => {
        return {
            id: apiArtist.id,
            name: apiArtist.name,
            slug: apiArtist.slug,
            image: apiArtist.avatarUrl || '/default-artist.jpg',
            genre: 'Music', // Default genre
            followers: Math.floor(Math.random() * 100000) + 1000, // Mock followers
        };
    };

    useEffect(() => {
        if (!keyword || keyword.trim() === "") {
            setArtists([]);
            return;
        }

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await searchService.search(keyword);
                const transformedArtists = result.artists.map(transformArtistData);
                setArtists(transformedArtists);
            } catch (err) {
                console.error("Error searching artists:", err);
                setError("Failed to search artists. Please try again.");
                setArtists([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
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
                <div className="mt-5 text-center text-(--text-secondary)">
                    <p>Loading artists...</p>
                </div>
            )}

            {error && (
                <div className="mt-5 text-center text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && artists.length === 0 && keyword && (
                <div className="mt-5 text-center text-(--text-secondary)">
                    <p>No artists found for "{keyword}"</p>
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