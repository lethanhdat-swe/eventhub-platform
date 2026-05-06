import { FireworksIcon } from '@/assets/icons';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useCallback, useState } from 'react';
import { events } from '../../data';
import EvenItem from '@/components/EventItem/EventItem';

function FeaturedEvents() {
  const [api, setApi] = useState(null);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <div className="container pt-7.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h1 className="text-(--text-primary)">Featured Events</h1>
          <FireworksIcon />
        </div>
        <div className="flex items-center gap-1">
          <Link to={'/events'} className="text-(--primary-color)">
            View All Events
          </Link>
          <ArrowRight color="var(--primary-color)" />
        </div>
      </div>

      <div className="relative px-8 mt-5">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            slidesToScroll: 1,
          }}
        >
          <CarouselContent>
            {events.map((event) => (
              <CarouselItem key={event.id} className="basis-1/4">
                <EvenItem event={event} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <button
            onClick={scrollPrev}
            className="absolute -left-15 top-1/2 -translate-y-1/2 z-50 rounded-full bg-[#f6f3f2]/80 hover:bg-[#f6f3f2] h-10 w-10 flex items-center justify-center cursor-pointer transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute -right-15 top-1/2 -translate-y-1/2 z-50 rounded-full bg-[#f6f3f2]/80 hover:bg-[#f6f3f2] h-10 w-10 flex items-center justify-center cursor-pointer transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </Carousel>
      </div>
    </div>
  );
}

export default FeaturedEvents;
