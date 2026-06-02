import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { blogService } from '@/lib/services/blog/blogService';
import { blogCategoryService } from '@/lib/services/blogCategory/blogCategoryService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import { buildBlogPayload, mapBlogRow } from '@/pages/(admin)/Blogs/data';
import { toast } from 'sonner';
import BlogForm from '../BlogForm/BlogForm';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const payload = await blogCategoryService.list({ page: 1, limit: 100 });
      setCategories(payload.items ?? []);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadBlog = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await blogService.getById(id);
      setFormValues(mapBlogRow(data));
    } catch (e) {
      setError(getErrorMessage(e));
      setFormValues(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadCategories();
    void loadBlog();
  }, [loadCategories, loadBlog]);

  const handleSubmit = async (form) => {
    if (!id) return;
    setSubmitting(true);
    setFormError('');
    try {
      await blogService.update(id, {
        ...buildBlogPayload(form),
        categoryId: form.categoryId || null,
      });
      toast.success('Cập nhật bài viết thành công');
      navigate('/admin/blogs');
    } catch (e) {
      const message = getErrorMessage(e);
      setFormError(message);
      toast.error(message || 'Cập nhật bài viết thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <p className="py-8 text-sm text-muted-foreground">Đang tải bài viết…</p>
    );
  }

  if (error || !formValues) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-1.5 px-2"
          onClick={() => navigate('/admin/blogs')}
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Button>
        <p className="text-sm text-destructive" role="alert">
          {error ?? 'Không tìm thấy bài viết.'}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void loadBlog()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="mt-0.5 shrink-0"
          aria-label="Quay lại"
          onClick={() => navigate('/admin/blogs')}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <PageHeader
          title="Chỉnh sửa bài viết"
          description="Cập nhật nội dung, danh mục và trạng thái bài viết."
          className="flex-1"
        />
      </div>

      <BlogForm
        key={id}
        initialValues={formValues}
        categories={categories}
        submitting={submitting}
        formError={formError}
        isCreate={false}
        submitLabel="Lưu thay đổi"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/blogs')}
      />
    </div>
  );
}

export default EditBlog;
