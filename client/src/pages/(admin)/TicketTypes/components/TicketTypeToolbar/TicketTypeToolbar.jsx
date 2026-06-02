import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';

function TicketTypeToolbar({
  searchInput,
  setSearchInput,
}) {
  return (
    <AdminToolbar
      searchPlaceholder="Tìm kiếm loại vé..."
      searchValue={searchInput}
      onSearchChange={setSearchInput}
    />
  );
}

export default TicketTypeToolbar;