import { ArrowRight, PlayCircle } from 'lucide-react';

function HeroTitle() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold tracking-widest text-purple-400 uppercase">
          ✦ Live for the Moment
        </span>
      </div>

      <h1 className="mb-4 text-5xl font-black leading-tight text-(--text-primary)">
        Discover Epic <br />
        Events & {''}
        <span className=" text-(--primary-color)">Unforgettable</span>
        <br />
        <span className="text-(--primary-color) ">Experiences</span>
      </h1>

      <p className="max-w-xl mb-8 text-sm leading-relaxed text-gray-400">
        Find the best concerts, festivals, and live experiences <br />
        happening near you and around the world.
      </p>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-full hover:opacity-90 hover:scale-105 bg-(--primary-color)">
          Explore Events <ArrowRight size={16} />
        </button>
        <button className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 border rounded-full border-white/20 hover:border-white/40 hover:bg-white/5 bg-(--background-color)/70">
          How It Works <PlayCircle size={16} />
        </button>
      </div>
    </div>
  );
}

export default HeroTitle;
