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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.list({
          page: 1,
          limit: 6,
          status: 'PUBLISHED',
        });

        setEvents(data.data || []);
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
      <TrendEvent />
      <HomeTestimonials />
      <HomeNewsletter />
      <GoToTop />
    </div>
  );
}

export default Home;
