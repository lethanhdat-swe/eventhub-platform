import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getErrorMessage } from '@/lib/http/apiError';
import { blogService } from '@/lib/services/blog/blogService';
import { blogCategoryService } from '@/lib/services/blogCategory/blogCategoryService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import BlogForm from '@/pages/(admin)/Blogs/components/BlogForm';
import { buildBlogPayload } from '@/pages/(admin)/Blogs/data';
import { toast } from 'sonner';

function CreateBlog() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const payload = await blogCategoryService.list({ page: 1, limit: 100 });
      setCategories(payload.items ?? []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setFormError('');
    try {
      await blogService.create(buildBlogPayload(form));
      toast.success('Tạo bài viết thành công');
      navigate('/admin/blogs');
    } catch (e) {
      const message = getErrorMessage(e);
      setFormError(message);
      toast.error(message || 'Tạo bài viết thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Tạo bài viết"
        description="Thêm bài viết mới và cấu hình nội dung hiển thị trên trang blog."
      />

      <BlogForm
        categories={categories}
        submitting={submitting}
        formError={formError}
        isCreate
        submitLabel="Tạo bài viết"
        onSubmit={(form) => void handleSubmit(form)}
        onCancel={() => navigate('/admin/blogs')}
      />
    </div>
  );
}

export default CreateBlog;
