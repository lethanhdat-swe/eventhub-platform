import FeaturedEvents from './components/FeaturedEvents';
import Hero from './components/Hero';
import CategoryItem from './components/CategoryItem';
import SearchSelect from './components/SearchSelect';
import Limit from './components/Limit/Limit';
import TrendEvent from './components/TrendEvent';
import GoToTop from '@/components/GoToTop/GoToTop';
import HomeTestimonials from './components/HomeTestimonials';
import HomeNewsletter from './components/HomeNewsletter';

function Home() {
  return (
    <div>
      <Hero />
      <SearchSelect />
      <CategoryItem />
      <FeaturedEvents />
      <Limit />
      <TrendEvent />
      <HomeTestimonials />
      <HomeNewsletter />
      <GoToTop />
    </div>
  );
}

export default Home;
