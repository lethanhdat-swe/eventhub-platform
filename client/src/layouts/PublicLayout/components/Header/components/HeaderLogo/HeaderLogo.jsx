import { Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeaderLogo({ scrolled }) {
  return (
    <div className="flex items-center gap-2">
      <Sparkle color="var(--primary-color)" />

      <Link
        to="/"
        className={`
          text-xl font-bold transition-colors duration-300
          ${scrolled ? 'text-(--text-primary)' : 'text-white'}
        `}
      >
        EventHub
      </Link>
    </div>
  );
}

export default HeaderLogo;
