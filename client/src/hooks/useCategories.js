import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { categoryService } from '@/lib/services/admin/categoryService';
import { mapCategoryRow } from '@/pages/(admin)/EventCategories/data';

const PAGE_SIZE = 10;

export function useCategories(search, { sortBy, sortOrder } = {}) {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await categoryService.list({
        page,
        limit: PAGE_SIZE,
        search,
        sortBy,
        sortOrder,
      });

      const rows = payload.data ?? [];

      setCategories(rows.map(mapCategoryRow));

      const m = payload.meta ?? {};

      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return {
    categories,
    meta,
    page,
    setPage,
    isLoading,
    error,
    setError,
    loadCategories,
  };
}