import React from 'react';
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
          group cursor-pointer inline-flex items-center justify-center rounded-full border px-2 py-2
          shadow-sm backdrop-blur-md transition-all duration-300
          hover:scale-110 hover:shadow-lg
          active:scale-95
          disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100
          ${
            isLiked
              ? 'border-white/20 bg-white/90 text-[#e2433d]'
              : 'border-white/20 bg-white/85 text-[#e2433d]'
          }
        `}
        style={{ minWidth: size + 16, minHeight: size + 16 }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <Heart
            size={size}
            fill={isLiked ? '#e2433d' : 'none'}
            color={isLiked ? '#e2433d' : 'currentColor'}
            className={`
              transition-all duration-300
              group-hover:scale-110
              ${isLiked ? 'animate-[heartBeat_350ms_ease-out]' : 'group-hover:fill-[#e2433d]/10'}
            `}
          />
        )}
      </button>

      {showCount && (
        <span
          className={`
            text-sm font-medium transition-colors duration-300
            ${isLiked ? 'text-[#e2433d]' : 'text-(--text-primary)'}
          `}
        >
          {Number(likeCount ?? 0).toLocaleString('vi-VN')}
        </span>
      )}

      {error && <span className="text-[11px] text-[#e2433d]">{error}</span>}
    </div>
  );
};

export default LikeButton;
