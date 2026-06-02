import { Button } from '@/components/ui/button';
import { AdminBulkActions } from '@/pages/(admin)/components/table';

export default function CouponBulkActions({
  selectedCount,
  onDelete,
}) {
  return (
    <AdminBulkActions
      selectedCount={selectedCount}
      label={`Đã chọn ${selectedCount} mã giảm giá`}
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