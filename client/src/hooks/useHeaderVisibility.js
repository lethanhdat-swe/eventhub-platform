import { useEffect, useRef, useState } from 'react';

export function useHeaderVisibility(threshold = 50) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setVisible(currentY < lastY.current || currentY < threshold);

      setScrolled(currentY > 700); // chiều cao banner

      lastY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return {
    visible,
    scrolled,
  };
}
