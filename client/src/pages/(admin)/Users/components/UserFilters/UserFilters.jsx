import { useMemo } from 'react';

import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import { USER_ROLE_OPTIONS } from '../../data';


const USER_EMAIL_FILTER_OPTIONS = [
  {
    value: 'all',
    label: 'Tất cả',
  },
  {
    value: 'verified',
    label: 'Đã xác thực',
  },
  {
    value: 'unverified',
    label: 'Chưa xác thực',
  },
];

function UserFilters({
  searchInput,
  setSearchInput,
  roleFilter,
  setRoleFilter,
  emailFilter,
  setEmailFilter,
}) {
  const roleOptions =
    useMemo(
      () => [
        {
          value: 'all',
          label: 'Tất cả',
        },
        ...USER_ROLE_OPTIONS.map(
          (item) => ({
            value: item.value,
            label: item.label,
          })
        ),
      ],
      []
    );

  return (
    <AdminToolbar
      searchPlaceholder="Tìm kiếm tên, email, số điện thoại..."
      searchValue={searchInput}
      onSearchChange={
        setSearchInput
      }
    >
      <AdminFilterDropdown
        label="Vai trò"
        options={roleOptions}
        value={roleFilter}
        onChange={setRoleFilter}
      />

      <AdminFilterDropdown
        label="Xác thực email"
        options={
          USER_EMAIL_FILTER_OPTIONS
        }
        value={emailFilter}
        onChange={setEmailFilter}
      />
    </AdminToolbar>
  );
}

export default UserFilters;