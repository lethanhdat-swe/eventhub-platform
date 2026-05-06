import FeaturedEvents from './components/FeaturedEvents/FeaturedEvents';
import Hero from './components/Hero/HeroHome';
import CategoryItem from './components/CategoryItem/CategoryItem';
import SearchSelect from './components/SearchSelect/SearchSelect';
import Limit from './components/Limit/Limit';
import TrendEvent from './components/TrendEvent/TrendEvent';
import GoToTop from '@/components/GoToTop/GoToTop';
import HomeTestimonials from './components/HomeTestimonials/HomeTestimonials';
import HomeNewsletter from './components/HomeNewsletter/HomeNewsletter';

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
