import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { userService } from '@/lib/services/admin/userService';

const PAGE_SIZE = 10;

export function useUsers({
  page,
  search,
  roleFilter,
  emailFilter,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState(null);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload =
        await userService.list({
          page,
          limit: PAGE_SIZE,
          search,
          role: roleFilter,
          emailVerified:
            emailFilter,
        });

      setUsers(payload.data ?? []);

      const m = payload.meta ?? {};

      setMeta({
        totalItems:
          m.totalItems ?? 0,
        totalPages: Math.max(
          1,
          m.totalPages ?? 1
        ),
        currentPage:
          m.currentPage ?? page,
        itemsPerPage:
          m.itemsPerPage ??
          PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    roleFilter,
    emailFilter,
  ]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return {
    users,
    meta,
    loading,
    error,
    setError,
    loadUsers,
  };
}