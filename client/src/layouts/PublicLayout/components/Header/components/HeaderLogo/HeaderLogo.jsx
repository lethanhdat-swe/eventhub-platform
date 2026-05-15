import { Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeaderLogo() {
  return (
    <div className="flex items-center gap-2">
      <Sparkle color="var(--primary-color)" />

      <Link
        to="/"
        className="text-xl font-bold text-(--text-primary)"
      >
        EventHub
      </Link>
    </div>
  );
}

export default HeaderLogo;