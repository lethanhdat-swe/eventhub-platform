import { useCallback, useState } from 'react';

import { getNextTableSort } from '@/pages/(admin)/components/table/tableSort';

/**
 * @param {{
 *   defaultSort?: { sortBy: string | null, sortOrder: 'asc' | 'desc' | null },
 *   initialSort?: { sortBy: string | null, sortOrder: 'asc' | 'desc' | null },
 *   onSortChange?: (next: { sortBy: string | null, sortOrder: 'asc' | 'desc' | null }) => void,
 * }} [options]
 */
export function useTableSort({
  defaultSort = { sortBy: null, sortOrder: null },
  initialSort,
  onSortChange,
} = {}) {
  const [sort, setSort] = useState(initialSort ?? defaultSort);

  const handleSort = useCallback(
    (field) => {
      setSort((prev) => {
        const next = getNextTableSort(prev, field, defaultSort);
        onSortChange?.(next);
        return next;
      });
    },
    [defaultSort, onSortChange]
  );

  const resetSort = useCallback(() => {
    setSort(defaultSort);
    onSortChange?.(defaultSort);
  }, [defaultSort, onSortChange]);

  return {
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    sort,
    setSort,
    handleSort,
    resetSort,
  };
}
