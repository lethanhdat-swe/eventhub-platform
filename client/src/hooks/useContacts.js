import { useCallback, useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { contactService } from '@/lib/services/contact';

const PAGE_SIZE = 10;

export function useContacts() {
  const [contacts, setContacts] = useState([]);

  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [selectedIds, setSelectedIds] =
    useState(() => new Set());

  const loadContacts = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const payload =
          await contactService.list({
            page,
            limit: PAGE_SIZE,
          });

        const items =
          payload.items ?? [];

        const m =
          payload.meta ?? {};

        setContacts(items);

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
        setError(
          getErrorMessage(e)
        );

        setContacts([]);

        setMeta({
          totalItems: 0,
          totalPages: 1,
          currentPage: page,
          itemsPerPage: PAGE_SIZE,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const handleSelectAll =
    useCallback(
      (checked) => {
        if (checked) {
          setSelectedIds(
            new Set(
              contacts.map(
                (contact) =>
                  contact.id
              )
            )
          );

          return;
        }

        setSelectedIds(
          new Set()
        );
      },
      [contacts]
    );

  const handleSelectRow =
    useCallback(
      (id, checked) => {
        setSelectedIds(
          (prev) => {
            const next =
              new Set(prev);

            if (checked) {
              next.add(id);
            } else {
              next.delete(id);
            }

            return next;
          }
        );
      },
      []
    );

  const clearSelection =
    useCallback(() => {
      setSelectedIds(
        new Set()
      );
    }, []);

  return {
    contacts,
    setContacts,

    page,
    setPage,

    meta,
    setMeta,

    isLoading,
    error,
    setError,

    selectedIds,
    setSelectedIds,

    loadContacts,

    handleSelectAll,
    handleSelectRow,

    clearSelection,
  };
}