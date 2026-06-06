import { useCallback, useEffect, useState } from 'react';
import { blogService } from '@/lib/services/blog/blogService';
import { getErrorMessage } from '@/lib/http/apiError';
import { mapBlogRow } from '@/pages/(admin)/Blogs/data';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const PAGE_SIZE = 10;

export function useBlogs({ sortBy, sortOrder } = {}) {
  const [blogs, setBlogs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300);
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = await blogService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      });

      setBlogs((payload.items ?? []).map(mapBlogRow));

      const m = payload.meta ?? {};

      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    void loadBlogs();
  }, [loadBlogs]);

  return {
    blogs,
    meta,
    page,
    setPage,
    searchInput,
    setSearchInput,
    isLoading,
    error,
    setError,
    loadBlogs,
  };
}