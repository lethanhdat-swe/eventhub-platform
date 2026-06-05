import { useMemo } from 'react';

import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';

function TicketFilters({
  searchInput,
  setSearchInput,
  checkInFilter,
  setCheckInFilter,
  eventFilter,
  setEventFilter,
  eventFilterOptions,
}) {
  const checkInFilterOptions = useMemo(
    () => [
      {
        value: 'all',
        label: 'Tất cả',
      },
      {
        value: 'checked',
        label: 'Đã check-in',
      },
      {
        value: 'unchecked',
        label: 'Chưa check-in',
      },
    ],
    []
  );

  return (
    <AdminToolbar
      searchPlaceholder="Tìm kiếm mã vé, đơn hàng, khách hàng..."
      searchValue={searchInput}
      onSearchChange={setSearchInput}
    >
      <AdminFilterDropdown
        label="Trạng thái check-in"
        options={checkInFilterOptions}
        value={checkInFilter}
        onChange={setCheckInFilter}
      />

      <AdminFilterDropdown
        label="Sự kiện"
        options={eventFilterOptions}
        value={eventFilter}
        onChange={setEventFilter}
      />
    </AdminToolbar>
  );
}

export default TicketFilters;