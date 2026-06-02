import { Button } from '@/components/ui/button';

import {
  AdminBulkActions,
} from '@/pages/(admin)/components/table';

function UserBulkActions({
  selectedCount,
  onNotify,
  onDelete,
}) {
  return (
    <AdminBulkActions
      selectedCount={selectedCount}
      label={`Đã chọn ${selectedCount} người dùng`}
    >
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="px-3 h-9"
          onClick={onNotify}
        >
          Gửi thông báo
        </Button>

        <Button
          type="button"
          variant="destructive"
          className="px-3 h-9"
          onClick={onDelete}
        >
          Xóa đã chọn
        </Button>
      </div>
    </AdminBulkActions>
  );
}

export default UserBulkActions;