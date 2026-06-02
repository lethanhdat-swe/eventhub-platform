import CouponFormDialog from "../CouponFormDialog/CouponFormDialog";
import DeleteCouponDialog from "../DeleteCouponDialog/DeleteCouponDialog";

export default function CouponDialogs({
  formDialog,
  deleteDialog,

  selectedCount,

  deleteSubmitting,

  formInitialValues,

  onSave,
  onCloseForm,

  onDeleteConfirm,
  onDeleteClose,
}) {
  return (
    <>
      <CouponFormDialog
        open={Boolean(formDialog)}
        mode={
          formDialog?.mode ??
          'create'
        }
        initialValues={
          formInitialValues
        }
        onOpenChange={(open) => {
          if (!open) {
            onCloseForm();
          }
        }}
        onSave={onSave}
      />

      <DeleteCouponDialog
        open={Boolean(deleteDialog)}
        isBulk={
          deleteDialog?.type ===
          'bulk'
        }
        couponCode={
          deleteDialog?.coupon?.code ??
          ''
        }
        selectedCount={
          selectedCount
        }
        isDeleting={
          deleteSubmitting
        }
        onConfirm={
          onDeleteConfirm
        }
        onCancel={
          onDeleteClose
        }
      />
    </>
  );
}