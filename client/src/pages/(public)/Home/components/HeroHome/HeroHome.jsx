import { useEffect, useState } from 'react';
import HeroTitle from './components/HeroTitle/HeroTitle';
import { getUploadPreviewSrc } from '@/lib/upload/uploadAsset';
import { bannerService } from '@/lib/services/banner';

function HeroHome() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannerService.getAllBanners();
        const urls = response?.map((b) => b.imageUrl).filter(Boolean);
        setHeroImages(urls || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section className="relative h-screen overflow-hidden bg-black min-h-180">
      {heroImages.map((image, index) => {
        const isActive = index === activeIndex;

        return (
          <img
            key={`${image}-${index}`}
            src={getUploadPreviewSrc(image)}
            alt=""
            className={`
              absolute inset-0 h-full w-full object-cover
              transition-opacity duration-2200 ease-in-out
              ${isActive ? 'opacity-100 animate-hero-zoom' : 'opacity-0 scale-[1.06]'}
            `}
          />
        );
      })}

      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/25" />

      <div className="relative z-10 flex items-center h-full">
        <div className="container">
          <HeroTitle />
        </div>
      </div>
    </section>
  );
}

export default HeroHome;