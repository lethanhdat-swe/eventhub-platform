import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import TestimonialItem from './components/TestimonialItem/TestimonialItem';
import { testimonials } from './data';
import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function HomeTestimonials() {
  const [api, setApi] = useState(null);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <section className="container mt-10 border-t py-15 border-(--text-primary)/10">
      <h2 className="mb-8 text-2xl font-bold text-(--text-primary)">
        What People Are Saying 🎉
      </h2>

      <div className="relative px-8 mt-5">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            slidesToScroll: 1,
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="basis-1/3">
                <TestimonialItem testimonial={testimonial} />
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
    </section>
  );
}

export default HomeTestimonials;
