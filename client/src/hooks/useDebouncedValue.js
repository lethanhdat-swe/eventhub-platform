import { useEffect, useState } from 'react';

/**
 * Debounce a value with setTimeout cleanup.
 * @param {T} value
 * @param {number} [delay=300]
 * @returns {T}
 * @template T
 */
export function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
