import { Heart, Loader2 } from 'lucide-react';
import useEventLike from '@/hooks/useEventlike';

const LikeButton = ({ eventId, size = 18, showCount = true }) => {
  const { likeCount, isLiked, isLoading, error, handleLike } =
    useEventLike(eventId);

  const onClick = (event) => {
    event.stopPropagation();

    if (isLoading) return;

    handleLike();
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        aria-pressed={isLiked}
        className={`
          group inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-3
          backdrop-blur-xl transition-all duration-300
          hover:scale-105 active:scale-95
          disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100
          ${
            isLiked
              ? 'border-[#e2433d]/30 bg-[#e2433d]/15 text-[#ff625d]'
              : 'border-white/15 bg-black/45 text-white/85 hover:border-[#e2433d]/40 hover:bg-[#e2433d]/10 hover:text-[#ff625d]'
          }
        `}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <Heart
            size={size}
            fill={isLiked ? 'currentColor' : 'none'}
            className={`
              transition-all duration-300 group-hover:scale-110
              ${isLiked ? 'animate-[heartBeat_350ms_ease-out]' : ''}
            `}
          />
        )}

        {showCount && (
          <span className="min-w-4 text-sm font-bold leading-none">
            {Number(likeCount ?? 0).toLocaleString('vi-VN')}
          </span>
        )}
      </button>

      {error && <span className="text-[11px] text-[#e2433d]">{error}</span>}
    </div>
  );
};

export default LikeButton;
