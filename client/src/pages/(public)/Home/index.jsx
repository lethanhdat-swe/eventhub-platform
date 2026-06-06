import HeroHome from './components/HeroHome/HeroHome';
import Limit from './components/Limit/Limit';
import TrendEvent from './components/TrendEvent/TrendEvent';
import { eventService } from '@/lib/services/admin';
import { useCallback, useEffect, useState } from 'react';
import CategoryBrowse from './components/CategoryBrowse/CategoryBrowse';
import FeaturedEvents from './components/FeaturedEvents/FeaturedEvents';
import HowItWorks from './components/HowItWorks/HowItWorks';
import HomeCTA from './components/CTA/CTA';
import { getErrorMessage } from '@/lib/http/apiError';
import PublicStatePanel from '@/components/PublicStatePanel/PublicStatePanel';

function Home() {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetchHomeEvents = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [trendingData, featuredData] = await Promise.all([
          eventService.eventTrend(),
          eventService.list({
            page: 1,
            limit: 6,
            status: 'PUBLISHED',
          }),
        ]);

        if (ignore) return;

        setTrendingEvents(trendingData || []);
        setEvents(featuredData.data || []);
      } catch (err) {
        if (!ignore) {
          setError(getErrorMessage(err) || 'Không thể tải sự kiện trang chủ');
          setTrendingEvents([]);
          setEvents([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void fetchEvents();

    return () => {
      ignore = true;
    };
  }, [reloadToken]);

  return (
    <main className="relative mb-10 overflow-hidden bg-(--background-color)">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-45 top-190 h-105 w-105 rounded-full bg-(--primary-color)/12 blur-[120px]" />
        <div className="absolute -right-55 top-320 h-125 w-125 rounded-full bg-orange-500/8 blur-[130px]" />
        <div className="absolute left-[18%] top-512.5 h-90 w-90 rounded-full bg-(--primary-color)/10 blur-[120px]" />
        <div className="absolute right-[8%] bottom-130 h-105 w-105 rounded-full bg-(--primary-color)/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        <HeroHome />
        {error ? (
          <div className="container py-6">
            <PublicStatePanel
              variant="error"
              title="Không thể tải sự kiện"
              description={error}
              onRetry={refetchHomeEvents}
            />
          </div>
        ) : null}
        <TrendEvent trendingEvents={trendingEvents} loading={isLoading} />
        <Limit />
        <CategoryBrowse />
        <FeaturedEvents events={events} loading={isLoading} />
        <HowItWorks />
        <HomeCTA />
      </div>
    </main>
  );
}

export default Home;
