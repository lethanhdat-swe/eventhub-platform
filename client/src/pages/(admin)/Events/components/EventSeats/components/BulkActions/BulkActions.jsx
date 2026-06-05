import { Button } from '@/components/ui/button';

export default function BulkActions({ selectedIds = [], onClearSelection, onDelete }) {
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    onDelete(selectedIds);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="text-sm font-medium">{selectedIds.length} ghế đã chọn</div>
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Bỏ chọn
        </Button>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={selectedIds.length === 0}
      >
        Xóa ghế đã chọn
      </Button>
    </div>
  );
}
