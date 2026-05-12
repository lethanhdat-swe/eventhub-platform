import { useSearchParams } from "react-router-dom";
import SearchHero from "./components/SearchHero/SearchHero";
import EventsSection from "./components/EventsSection/EventsSection";
import ArtistsSection from "./components/ArtistsSection/ArtistsSection";

function Search() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q');

    return ( 
        <div className="pt-(--header-height)">
            <SearchHero keyword={keyword}/>
            <EventsSection />
            <ArtistsSection />
        </div>
     );
}

export default Search;