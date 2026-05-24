import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import useEventLike from '@/hooks/useEventlike';

const LikeButton = ({ eventId, size = 18, showCount = true }) => {
  const { likeCount, isLiked, isLoading, error, handleLike } = useEventLike(eventId);

  const onClick = (event) => {
    event.stopPropagation();
    handleLike();
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        aria-pressed={isLiked}
        className={`inline-flex items-center justify-center rounded-full border px-2 py-2 transition disabled:cursor-not-allowed ${
          isLiked
            ? 'border-[#e2433d] bg-[#ffe5e3] text-[#e2433d]'
            : 'border-[#747474] bg-(--background-color)/70 text-(--text-primary)'
        }`}
        style={{ minWidth: size + 12, minHeight: size + 12 }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size} />
        ) : (
          <Heart size={size} fill={isLiked ? '#e2433d' : 'none'} color={isLiked ? '#e2433d' : 'currentColor'} />
        )}
      </button>

      {showCount && (
        <span className={`text-sm font-medium ${isLiked ? 'text-[#e2433d]' : 'text-(--text-primary)'}`}>
          {Number(likeCount ?? 0).toLocaleString('vi-VN')}
        </span>
      )}

      {error && <span className="text-[11px] text-[#e2433d]">{error}</span>}
    </div>
  );
};

export default LikeButton;
