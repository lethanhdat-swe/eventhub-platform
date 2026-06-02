import CategoryFormDialog from '../CategoryFormDialog/CategoryFormDialog';
import DeleteCategoryDialog from '../DeleteCategoryDialog/DeleteCategoryDialog';

function CategoryDialogs({
  formDialog,
  deleteDialog,
  selectedIds,
  deleteSubmitting,
  onSave,
  onDeleteConfirm,
  setFormDialog,
  setDeleteDialog,
}) {
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          name: formDialog.category.name,
          slug: formDialog.category.slug,
        }
      : {
          name: '',
          slug: '',
        };

  return (
    <>
      <CategoryFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(open) => {
          if (!open) setFormDialog(null);
        }}
        onSave={onSave}
      />

      <DeleteCategoryDialog
        open={Boolean(deleteDialog)}
        isBulk={deleteDialog?.type === 'bulk'}
        categoryName={deleteDialog?.category?.name ?? ''}
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={onDeleteConfirm}
        onCancel={() => {
          if (!deleteSubmitting) {
            setDeleteDialog(null);
          }
        }}
      />
    </>
  );
}

export default CategoryDialogs;