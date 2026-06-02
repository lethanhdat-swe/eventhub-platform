import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';

export default function CouponFilters({
  searchInput,
  setSearchInput,

  statusFilter,
  setStatusFilter,

  validityFilter,
  setValidityFilter,

  couponStatusFilterOptions,
  couponValidityFilterOptions,
}) {
  return (
    <AdminToolbar
      searchPlaceholder="Tìm kiếm mã giảm giá..."
      searchValue={searchInput}
      onSearchChange={setSearchInput}
    >
      <AdminFilterDropdown
        label="Trạng thái"
        options={couponStatusFilterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <AdminFilterDropdown
        label="Hạn sử dụng"
        options={couponValidityFilterOptions}
        value={validityFilter}
        onChange={setValidityFilter}
      />
    </AdminToolbar>
  );
}