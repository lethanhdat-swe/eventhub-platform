import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { blogService } from '@/lib/services/blog/blogService';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
} from '@/pages/(admin)/components/table';
import DeleteBlogDialog from './components/DeleteBlogDialog/DeleteBlogDialog';
import { useBlogs } from '@/hooks/useBlogs';
import { useBlogSelection } from '@/hooks/useBlogSelection';
import BlogsError from './components/BlogsError/BlogsError';
import BlogsTableSection from './components/BlogsTableSection/BlogsTableSection';

function Blogs() {
  const navigate = useNavigate();

  const {
    blogs,
    meta,
    setPage,
    searchInput,
    setSearchInput,
    isLoading,
    error,
    setError,
    loadBlogs,
  } = useBlogs();

  const {
    selectedIds,
    setSelectedIds,
    selectAll,
    selectRow,
  } = useBlogSelection();

  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);

    try {
      if (deleteDialog.type === 'bulk') {
        await blogService.deleteMany([...selectedIds]);

        setSelectedIds(new Set());

        toast.success(
          `Đã xóa ${selectedIds.size} bài viết`
        );
      } else {
        await blogService.deleteMany([
          deleteDialog.blog.id,
        ]);

        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.blog.id);
          return next;
        });

        toast.success(
          `Đã xóa bài viết "${deleteDialog.blog.title}"`
        );
      }

      setDeleteDialog(null);

      await loadBlogs();
    } catch (e) {
      const message = getErrorMessage(e);

      setError(message);

      toast.error(
        message || 'Xóa bài viết thất bại'
      );
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    navigate(`/admin/blogs/${blog.id}/edit`);
  };

  const handleDelete = (blog) => {
    setDeleteDialog({
      type: 'single',
      blog,
    });
  };

  const isEmpty =
    !isLoading && blogs.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý bài viết"
        description="Tạo, chỉnh sửa và xuất bản bài viết hiển thị trên trang blog."
        actionLabel="Thêm bài viết"
        actionIcon={<Plus className="size-4" />}
        onAction={() =>
          navigate('/admin/blogs/create')
        }
      />

      {error && blogs.length > 0 && (
        <BlogsError
          error={error}
          onRetry={() => void loadBlogs()}
        />
      )}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm bài viết..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} bài viết`}
      >
        <Button
          type="button"
          variant="destructive"
          className="px-3 h-9"
          onClick={() =>
            setDeleteDialog({
              type: 'bulk',
            })
          }
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState
          rows={6}
          columns={7}
          minWidth="min-w-[1040px]"
        />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title:
                  'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () =>
                  void loadBlogs(),
              }
            : {
                title: 'Chưa có bài viết',
                description:
                  'Tạo bài viết đầu tiên để hiển thị trên trang blog.',
                actionLabel:
                  'Thêm bài viết',
                onAction: () =>
                  navigate(
                    '/admin/blogs/create'
                  ),
              })}
        />
      ) : (
        <BlogsTableSection
          blogs={blogs}
          meta={meta}
          selectedIds={selectedIds}
          onSelectAll={(checked) =>
            selectAll(checked, blogs)
          }
          onSelectRow={selectRow}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={setPage}
        />
      )}

      <DeleteBlogDialog
        open={Boolean(deleteDialog)}
        isBulk={deleteDialog?.type === 'bulk'}
        blogTitle={
          deleteDialog?.blog?.title ?? ''
        }
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={() =>
          void handleDeleteConfirm()
        }
        onCancel={() => {
          if (!deleteSubmitting) {
            setDeleteDialog(null);
          }
        }}
      />
    </div>
  );
}

export default Blogs;