import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function BackButton() {
  return (
    <Link
      to="/blogs"
      className="
        group inline-flex items-center gap-2 rounded-full
        border border-(--border-color)
        bg-(--card-surface-color) px-4 py-2.5
        text-sm font-bold text-(--text-primary)
        shadow-[0_12px_35px_rgba(0,0,0,0.18)]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-0.5 hover:border-(--primary-color)/50
        hover:bg-(--primary-color)/10
        active:scale-95
      "
    >
      <ArrowLeft
        size={17}
        className="
          text-(--muted-text)
          transition-transform duration-300
          group-hover:-translate-x-1 group-hover:text-(--primary-color)
        "
      />
      Quay lại Blog
    </Link>
  );
}

export default BackButton;
