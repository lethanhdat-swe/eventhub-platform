import FeaturedEvents from './components/FeaturedEvents/FeaturedEvents';
import HeroHome from './components/HeroHome/HeroHome';
import Limit from './components/Limit/Limit';
import TrendEvent from './components/TrendEvent/TrendEvent';
import GoToTop from '@/components/GoToTop/GoToTop';
import HomeTestimonials from './components/HomeTestimonials/HomeTestimonials';
import HomeNewsletter from './components/HomeNewsletter/HomeNewsletter';
import { eventService } from '@/lib/services/admin';
import { useEffect, useState } from 'react';

function Home() {
  const [events, setEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const event = await eventService.list({
          page: 1,
          limit: 6,
          status: 'PUBLISHED',
        });
        setEvents(event.data || []);

        const trendingData = await eventService.eventTrend();
        setTrendingEvents(trendingData|| []);

      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className='mb-10'>
      <HeroHome />
      <FeaturedEvents events={events}/>
      <Limit />
      <TrendEvent trendingEvents={trendingEvents} />
      <HomeTestimonials />
      <HomeNewsletter />
      <GoToTop />
    </div>
  );
}

export default Home;
