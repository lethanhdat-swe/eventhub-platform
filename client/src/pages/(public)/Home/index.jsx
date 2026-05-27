import HeroHome from './components/HeroHome/HeroHome';
import Limit from './components/Limit/Limit';
import TrendEvent from './components/TrendEvent/TrendEvent';
import GoToTop from '@/components/GoToTop/GoToTop';
import { eventService } from '@/lib/services/admin';
import { useEffect, useState } from 'react';
import CategoryBrowse from './components/CategoryBrowse/CategoryBrowse';
import FeaturedEvents from './components/FeaturedEvents/FeaturedEvents';
import HowItWorks from './components/HowItWorks/HowItWorks';
import HomeCTA from './components/CTA/CTA';

function Home() {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const trendingData = await eventService.eventTrend();
        setTrendingEvents(trendingData || []);

        const featuredData = await eventService.list({
          page: 1,
          limit: 6,
          status: 'PUBLISHED',
        });

        setEvents(featuredData.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="relative mb-10 overflow-hidden bg-(--background-color)">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-180px] top-[760px] h-[420px] w-[420px] rounded-full bg-(--primary-color)/12 blur-[120px]" />
        <div className="absolute right-[-220px] top-[1280px] h-[500px] w-[500px] rounded-full bg-orange-500/8 blur-[130px]" />
        <div className="absolute left-[18%] top-[2050px] h-[360px] w-[360px] rounded-full bg-(--primary-color)/10 blur-[120px]" />
        <div className="absolute right-[8%] bottom-[520px] h-[420px] w-[420px] rounded-full bg-(--primary-color)/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        <HeroHome />
        <TrendEvent trendingEvents={trendingEvents} />
        <Limit />
        <CategoryBrowse />
        <FeaturedEvents events={events} />
        <HowItWorks />
        <HomeCTA />
        <GoToTop />
      </div>
    </main>
  );
}

export default Home;
