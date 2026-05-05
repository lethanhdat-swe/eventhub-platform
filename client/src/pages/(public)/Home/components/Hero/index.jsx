import { images } from '@/assets';
import HeroTitle from './components/HeroTitle';
import HappyCustomers from './components/HappyCustomers';

function Hero() {
  return (
    <div className="relative">
      <img src={images.home} alt="" className="object-cover w-full h-150" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />

      <div className="container absolute flex items-end justify-between top-40 left-10 right-10">
        <HeroTitle />
        <HappyCustomers />
      </div>
    </div>
  );
}

export default Hero;
