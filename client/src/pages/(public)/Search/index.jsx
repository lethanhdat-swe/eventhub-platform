import { useSearchParams } from 'react-router-dom';
import SearchHero from './components/SearchHero/SearchHero';
import EventsSection from './components/EventsSection/EventsSection';
import ArtistsSection from './components/ArtistsSection/ArtistsSection';

function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');

  return (
    <div>
      <SearchHero keyword={keyword} />
      <EventsSection keyword={keyword} />
      <ArtistsSection keyword={keyword} />
    </div>
  );
}

export default Search;
