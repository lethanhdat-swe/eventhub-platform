import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

function HeroTitle() {
  return (
    <div className="max-w-3xl">
      <div className="mb-5 inline-flex items-center gap-2">
        <span className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--primary-color)] drop-shadow-[0_0_18px_rgba(124,58,237,0.8)]">
          ✦ Live for the Moment
        </span>
      </div>

      <h1 className="mb-5 text-[64px] font-black leading-[1.08] tracking-[-0.04em] text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
        Discover Epic <br />
        Events &{' '}
        <span className="bg-gradient-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          Unforgettable
        </span>
        <br />
        <span className="bg-gradient-to-r from-[#a855f7] via-[#9333ea] to-[#7c3aed] bg-clip-text text-transparent">
          Experiences
        </span>
      </h1>

      <div className="mb-9 h-16 max-w-xl overflow-hidden text-base leading-8 text-white/65">
        <Typewriter
          options={{
            strings: [
              'Find the best concerts, festivals, and live experiences happening near you and around the world.',
            ],
            autoStart: true,
            loop: true,
            delay: 55,
            deleteSpeed: 35,
            cursor: '|',
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/events"
          className="
            group inline-flex items-center gap-2 rounded-full
            bg-[var(--primary-color)] px-7 py-3.5
            text-sm font-bold text-white
            shadow-[0_14px_40px_rgba(124,58,237,0.38)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(124,58,237,0.5)]
            active:scale-95
          "
        >
          Explore Events
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <button
          className="
            group inline-flex items-center gap-2 rounded-full
            border border-white/15 bg-white/10 px-7 py-3.5
            text-sm font-bold text-white
            backdrop-blur-xl
            transition-all duration-300
            hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15
            active:scale-95
          "
        >
          How It Works
          <PlayCircle
            size={17}
            className="text-white/70 transition-transform duration-300 group-hover:scale-110"
          />
        </button>
      </div>
    </div>
  );
}

export default HeroTitle;
