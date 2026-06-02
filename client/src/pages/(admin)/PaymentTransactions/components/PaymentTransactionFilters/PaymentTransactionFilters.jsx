import { useMemo } from 'react';

import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import { PAYMENT_TRANSACTION_STATUS_LABELS } from '../../data';


function PaymentTransactionFilters({
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
}) {
  const statusFilterOptions = useMemo(
    () => [
      {
        value: 'all',
        label: 'Tất cả',
      },
      ...Object.entries(PAYMENT_TRANSACTION_STATUS_LABELS).map(
        ([value]) => ({
          value,
          label: value,
        })
      ),
    ],
    []
  );

  return (
    <AdminToolbar
      searchPlaceholder="Tìm mã giao dịch, mã đơn, nội dung chuyển khoản..."
      searchValue={searchInput}
      onSearchChange={setSearchInput}
    >
      <AdminFilterDropdown
        label="Trạng thái"
        options={statusFilterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />
    </AdminToolbar>
  );
}

export default PaymentTransactionFilters;