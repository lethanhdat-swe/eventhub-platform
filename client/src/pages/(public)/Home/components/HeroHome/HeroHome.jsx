import { useEffect, useState } from 'react';
import HeroTitle from './components/HeroTitle/HeroTitle';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
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
        <section className="relative h-[70vh] min-h-100 overflow-hidden bg-black sm:h-[86vh] sm:min-h-155 md:h-[88vh] md:min-h-170 lg:h-screen lg:min-h-180">
            {heroImages.map((image, index) => {
                const isActive = index === activeIndex;

                return (
                    <img
                        key={`${image}-${index}`}
                        src={resolvePublicAssetUrl(image, '')}
                        alt=""
                        className={`
              absolute inset-0 h-full w-full object-cover object-center
              transition-opacity duration-2200 ease-in-out
              md:object-[60%_center] lg:object-center
              ${isActive ? 'opacity-100 animate-hero-zoom' : 'opacity-0 scale-[1.06]'}
            `}
                    />
                );
            })}

            <div className="relative z-10 flex items-center h-full">
                <div className="container">
                    <HeroTitle />
                </div>
            </div>
        </section>
    );
}

export default HeroHome;
