import { Button } from '@/components/ui/button';
import { AdminBulkActions } from '@/pages/(admin)/components/table';

export default function ContactBulkActions({
  selectedCount,
  onDelete,
}) {
  return (
    <AdminBulkActions
      selectedCount={selectedCount}
      label={`Đã chọn ${selectedCount} liên hệ`}
    >
      <Button
        type="button"
        variant="destructive"
        className="px-3 h-9"
        onClick={onDelete}
      >
        Xóa đã chọn
      </Button>
    </AdminBulkActions>
  );
}