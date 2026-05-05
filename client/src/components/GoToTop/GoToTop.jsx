import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

function GoToTop() {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className="group fixed bottom-30 right-8 z-50 w-12 h-12 rounded-full cursor-pointer overflow-hidden
    flex items-center justify-center
    bg-(--primary-color) text-white
    border border-white/20
    shadow-[0_0_20px_var(--primary-color)]
    hover:shadow-[0_0_35px_var(--primary-color)]
    hover:-translate-y-1.5
    active:scale-90
    transition-all duration-300 ease-out"
          aria-label="Scroll to top"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-(--primary-color)/30" />

          {/* Rotating arc */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin animation-duration-[3s]"
            viewBox="0 0 48 48"
            fill="none"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="30 100"
              strokeLinecap="round"
              strokeOpacity="0.5"
            />
          </svg>

          {/* Ripple overlay */}
          <span className="absolute inset-0 transition-transform duration-300 scale-0 rounded-full bg-white/20 group-hover:scale-100" />

          <ChevronUp
            size={20}
            strokeWidth={2.5}
            className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </button>
      )}
    </>
  );
}

export default GoToTop;
