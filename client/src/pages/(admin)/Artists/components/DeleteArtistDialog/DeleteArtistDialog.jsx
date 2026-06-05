import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function DeleteArtistDialog({
  open,
  isBulk,
  artistName,
  selectedCount,
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  const title = isBulk ? 'Xóa nghệ sĩ đã chọn' : 'Xóa nghệ sĩ';
  const description = isBulk
    ? `Bạn có chắc muốn xóa ${selectedCount} nghệ sĩ đã chọn? Hành động không thể hoàn tác.`
    : `Bạn có chắc muốn xóa "${artistName}"? Hành động không thể hoàn tác.`;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isDeleting) onCancel();
      }}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-left sm:text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm?.();
            }}
          >
            {isDeleting ? 'Đang xóa…' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteArtistDialog;
