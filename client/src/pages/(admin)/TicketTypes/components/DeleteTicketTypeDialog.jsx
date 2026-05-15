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

function DeleteTicketTypeDialog({
  open,
  isBulk,
  typeName,
  selectedCount,
  onConfirm,
  onCancel,
}) {
  const title = isBulk ? 'Xóa loại vé đã chọn' : 'Xóa loại vé';
  const description = isBulk
    ? `Bạn có chắc muốn xóa ${selectedCount} loại vé đã chọn? Hành động không thể hoàn tác.`
    : `Bạn có chắc muốn xóa loại vé "${typeName}"? Hành động không thể hoàn tác.`;

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

export default DeleteTicketTypeDialog;
