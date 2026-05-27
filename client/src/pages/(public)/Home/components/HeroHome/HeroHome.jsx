import { useEffect, useState } from 'react';
import { images } from '@/assets';
import HeroTitle from './components/HeroTitle/HeroTitle';
import Popular from './components/Popular/Popular';

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
    <div className="relative h-screen overflow-hidden bg-black">
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

      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />

      <div className="container absolute bottom-30 left-10 right-10 flex items-end justify-between">
        <HeroTitle />
        <Popular />
      </div>
    </div>
  );
}

export default HeroHome;
