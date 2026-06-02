import { useMemo } from 'react';

import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import { REFUND_STATUS_LABELS } from '../../data';


function RefundFilters({
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
}) {
  const refundStatusFilterOptions = useMemo(
    () => [
      {
        value: 'all',
        label: 'Tất cả',
      },
      ...Object.entries(REFUND_STATUS_LABELS).map(
        ([value, label]) => ({
          value,
          label,
        })
      ),
    ],
    []
  );

  return (
    <AdminToolbar
      searchPlaceholder="Tìm kiếm mã đơn, khách hàng, email, SĐT..."
      searchValue={searchInput}
      onSearchChange={setSearchInput}
    >
      <AdminFilterDropdown
        label="Trạng thái"
        options={refundStatusFilterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />
    </AdminToolbar>
  );
}

export default RefundFilters;