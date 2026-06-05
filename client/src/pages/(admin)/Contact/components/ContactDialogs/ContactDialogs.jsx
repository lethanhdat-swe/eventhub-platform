import DeleteContactDialog from '../DeleteContactDialog/DeleteContactDialog';
import ContactDetailDialog from '../ContactDetailDialog/ContactDetailDialog';

export default function ContactDialogs({
  deleteDialog,
  selectedCount,
  detailDialog,

  onDeleteConfirm,
  onDeleteClose,

  onDetailChange,
}) {
  return (
    <>
      <DeleteContactDialog
        open={Boolean(deleteDialog)}
        isBulk={deleteDialog?.type === 'bulk'}
        contactName={
          deleteDialog?.contact?.fullName ?? ''
        }
        selectedCount={selectedCount}
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteClose}
      />

      <ContactDetailDialog
        open={detailDialog.open}
        onOpenChange={onDetailChange}
        contact={detailDialog.contact}
        loading={false}
      />
    </>
  );
}