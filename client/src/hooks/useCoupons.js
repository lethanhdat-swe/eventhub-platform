import { useCallback, useEffect, useMemo, useState } from 'react';

import { getErrorMessage } from '@/lib/http/apiError';
import { couponService } from '@/lib/services/admin/couponService';

import {
  COUPON_STATUS_OPTIONS,
  mapCouponRow,
} from '@/pages/(admin)/Coupons/data';

const PAGE_SIZE = 10;

export function useCoupons({ sortBy, sortOrder } = {}) {
  const [coupons, setCoupons] = useState([]);

  const [searchInput, setSearchInput] =
    useState('');

  const [debouncedSearch, setDebouncedSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  const [validityFilter, setValidityFilter] =
    useState('all');

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

  const couponStatusFilterOptions =
    useMemo(
      () => [
        {
          value: 'all',
          label: 'Tất cả',
        },
        ...COUPON_STATUS_OPTIONS.map(
          (option) => ({
            value: option.value,
            label: option.label,
          })
        ),
      ],
      []
    );

  const couponValidityFilterOptions =
    useMemo(
      () => [
        {
          value: 'all',
          label: 'Tất cả',
        },
        {
          value: 'valid',
          label: 'Còn hạn',
        },
        {
          value: 'expired',
          label: 'Đã hết hạn',
        },
      ],
      []
    );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(
        searchInput.trim()
      );
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    statusFilter,
    validityFilter,
  ]);

  const loadCoupons = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const payload =
          await couponService.list({
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch,
            status: statusFilter,
            validity:
              validityFilter,
            sortBy,
            sortOrder,
          });

        const rows =
          payload.data ?? [];

        const m =
          payload.meta ?? {};

        setCoupons(
          rows.map(mapCouponRow)
        );

        setMeta({
          totalItems:
            m.totalItems ?? 0,

          totalPages: Math.max(
            1,
            m.totalPages ?? 1
          ),

          currentPage:
            m.currentPage ??
            page,

          itemsPerPage:
            m.itemsPerPage ??
            PAGE_SIZE,
        });
      } catch (e) {
        setError(
          getErrorMessage(e)
        );

        setCoupons([]);

        setMeta({
          totalItems: 0,
          totalPages: 1,
          currentPage: page,
          itemsPerPage:
            PAGE_SIZE,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      page,
      debouncedSearch,
      statusFilter,
      validityFilter,
      sortBy,
      sortOrder,
    ]
  );

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  const handleSelectAll =
    useCallback(
      (checked) => {
        if (checked) {
          setSelectedIds(
            new Set(
              coupons.map(
                (coupon) =>
                  coupon.id
              )
            )
          );

          return;
        }

        setSelectedIds(
          new Set()
        );
      },
      [coupons]
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
    coupons,

    searchInput,
    setSearchInput,

    statusFilter,
    setStatusFilter,

    validityFilter,
    setValidityFilter,

    page,
    setPage,

    meta,

    isLoading,
    error,
    setError,

    selectedIds,
    setSelectedIds,

    couponStatusFilterOptions,
    couponValidityFilterOptions,

    loadCoupons,

    handleSelectAll,
    handleSelectRow,

    clearSelection,
  };
}