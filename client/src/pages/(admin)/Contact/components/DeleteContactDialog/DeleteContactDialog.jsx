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

function DeleteContactDialog({
  open,
  isBulk,
  contactName,
  selectedCount,
  onConfirm,
  onCancel,
}) {
  const title = isBulk ? 'Xóa liên hệ đã chọn' : 'Xóa liên hệ';
  const description = isBulk
    ? `Bạn có chắc muốn xóa ${selectedCount} liên hệ đã chọn? Hành động không thể hoàn tác.`
    : `Bạn có chắc muốn xóa liên hệ từ "${contactName}"? Hành động không thể hoàn tác.`;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-left sm:text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            onClick={onConfirm}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteContactDialog;