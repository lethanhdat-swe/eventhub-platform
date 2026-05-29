import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { blogService } from '@/lib/services/blog/blogService';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
} from '@/pages/(admin)/components/table';
import BlogTable from '@/pages/(admin)/Blogs/components/BlogTable';
import DeleteBlogDialog from '@/pages/(admin)/Blogs/components/DeleteBlogDialog';
import { mapBlogRow } from '@/pages/(admin)/Blogs/data';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function Blogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await blogService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
      });

      const rows = payload.items ?? [];
      setBlogs(rows.map(mapBlogRow));

      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    void loadBlogs();
  }, [loadBlogs]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(blogs.map((blog) => blog.id)));
      return;
    }

    setSelectedIds(new Set());
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await blogService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
        toast.success(`Đã xóa ${selectedIds.size} bài viết`);
      } else {
        await blogService.deleteMany([deleteDialog.blog.id]);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.blog.id);
          return next;
        });
        toast.success(`Đã xóa bài viết "${deleteDialog.blog.title}"`);
      }
      setDeleteDialog(null);
      await loadBlogs();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Xóa bài viết thất bại');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    navigate(`/admin/blogs/${blog.id}/edit`);
  };

  const handleDelete = (blog) => {
    setDeleteDialog({ type: 'single', blog });
  };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteBlogTitle = deleteDialog?.blog?.title ?? '';
  const isEmpty = !isLoading && blogs.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý bài viết"
        description="Tạo, chỉnh sửa và xuất bản bài viết hiển thị trên trang blog."
        actionLabel="Thêm bài viết"
        actionIcon={<Plus className="size-4" />}
        onAction={() => navigate('/admin/blogs/create')}
      />

      {error && blogs.length > 0 ? (
        <div
          className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 cursor-pointer shrink-0"
            onClick={() => void loadBlogs()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

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
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={7} minWidth="min-w-[1040px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadBlogs(),
              }
            : {
                title: 'Chưa có bài viết',
                description: 'Tạo bài viết đầu tiên để hiển thị trên trang blog.',
                actionLabel: 'Thêm bài viết',
                onAction: () => navigate('/admin/blogs/create'),
              })}
        />
      ) : (
        <>
          <BlogTable
            blogs={blogs}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <AdminPagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            pageSize={meta.itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <DeleteBlogDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        blogTitle={deleteBlogTitle}
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteSubmitting) setDeleteDialog(null);
        }}
      />
    </div>
  );
}

export default Blogs;
