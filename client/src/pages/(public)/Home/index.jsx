import HeroHome from './components/HeroHome/HeroHome';
import Limit from './components/Limit/Limit';
import TrendEvent from './components/TrendEvent/TrendEvent';
import GoToTop from '@/components/GoToTop/GoToTop';
import HomeTestimonials from './components/HomeTestimonials/HomeTestimonials';
import HomeNewsletter from './components/HomeNewsletter/HomeNewsletter';
import { eventService } from '@/lib/services/admin';
import { useEffect, useState } from 'react';
import CategoryBrowse from './components/CategoryBrowse/CategoryBrowse';
import FeaturedEvents from './components/FeaturedEvents/FeaturedEvents';

function Home() {
  const [trendingEvents, setTrendingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const trendingData = await eventService.eventTrend();
        setTrendingEvents(trendingData || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="mb-10">
      <HeroHome />
      <TrendEvent trendingEvents={trendingEvents} />
      <Limit />
      <CategoryBrowse />
      <FeaturedEvents />
      <HomeTestimonials />
      <HomeNewsletter />
      <GoToTop />
    </div>
  );
}

export default Home;
