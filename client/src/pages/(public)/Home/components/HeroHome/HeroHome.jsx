import { useEffect, useState } from 'react';
import { images } from '@/assets';
import HeroTitle from './components/HeroTitle/HeroTitle';

const heroImages = [images.home, images.Pornhub, images.avatar1];

function HeroHome() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden bg-black">
      {heroImages.map((image, index) => {
        const isActive = index === activeIndex;

        return (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            className={`
              absolute inset-0 h-full w-full object-cover
              transition-opacity duration-[2200ms] ease-in-out
              ${isActive ? 'opacity-100 animate-hero-zoom' : 'opacity-0 scale-[1.06]'}
            `}
          />
        );
      })}

      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/25" />

      <div className="relative z-10 flex h-full items-center">
        <div className="container">
          <HeroTitle />
        </div>
      </div>
    </section>
  );
}

export default HeroHome;
