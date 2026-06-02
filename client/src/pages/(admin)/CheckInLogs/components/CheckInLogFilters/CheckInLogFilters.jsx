import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';

export default function CheckInLogFilters({
  searchInput,
  setSearchInput,

  eventFilter,
  setEventFilter,
  eventFilterOptions,

  statusFilter,
  setStatusFilter,
  statusOptions,
}) {
  return (
    <AdminToolbar
      searchPlaceholder="Tìm token, khách hàng, sự kiện..."
      searchValue={searchInput}
      onSearchChange={setSearchInput}
    >
      <AdminFilterDropdown
        label="Sự kiện"
        options={eventFilterOptions}
        value={eventFilter}
        onChange={setEventFilter}
      />

      <AdminFilterDropdown
        label="Trạng thái"
        options={statusOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />
    </AdminToolbar>
  );
}