import { Button } from '@/components/ui/button';

import { AdminBulkActions } from '@/pages/(admin)/components/table';

function TicketTypeBulkActions({
  selectedCount,
  onDelete,
}) {
  return (
    <AdminBulkActions
      selectedCount={selectedCount}
      label={`Đã chọn ${selectedCount} loại vé`}
    >
      <Button
        type="button"
        variant="destructive"
        className="px-3 h-9"
        disabled={selectedCount === 0}
        onClick={onDelete}
      >
        Xóa đã chọn
      </Button>
    </AdminBulkActions>
  );
}

export default TicketTypeBulkActions;