import { useState, useEffect, useCallback } from 'react';
import { getLikeInfo, toggleLike } from '@/lib/services/likeService';
import { toast } from 'sonner';

const useEventLike = (eventId) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setLikeCount(0);
      setIsLiked(false);
      setError(null);
      return;
    }

    let active = true;

    const fetchLikeInfo = async () => {
      try {
        const data = await getLikeInfo(eventId);
        if (!active) return;
        setLikeCount(data.likeCount ?? 0);
        setIsLiked(Boolean(data.isLiked));
      } catch (err) {
        if (!active) return;
        console.error('Lỗi fetch like info:', err);
        setError('Không thể tải thông tin lượt tim');
      }
    };

    fetchLikeInfo();
    return () => {
      active = false;
    };
  }, [eventId]);

  const handleLike = useCallback(async () => {
    if (!eventId || isLoading) return;

    setIsLoading(true);
    setError(null);

    const currentLiked = isLiked;
    const currentCount = likeCount;
    setIsLiked(!currentLiked);
    setLikeCount(
      currentLiked ? Math.max(0, currentCount - 1) : currentCount + 1
    );

    try {
      const data = await toggleLike(eventId);
      setLikeCount(data.likeCount ?? 0);
      setIsLiked(Boolean(data.isLiked));
      toast.success(
        data.isLiked
          ? 'Bạn đã thích sự kiện này!'
          : 'Bạn đã bỏ thích sự kiện này!'
      );
    } catch (err) {
      setIsLiked(currentLiked);
      setLikeCount(currentCount);
      setError('Có lỗi xảy ra');
      console.error('Lỗi toggle like:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, isLiked, likeCount, isLoading]);

  return { likeCount, isLiked, isLoading, error, handleLike };
};

export default useEventLike;
