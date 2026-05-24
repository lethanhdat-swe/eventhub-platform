import { normalizeStoredUploadFilename } from '@/lib/upload/uploadAsset';

export const BLOG_STATUS_OPTIONS = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'published', label: 'Đã xuất bản' },
];

export const BLOG_STATUS_LABELS = {
  DRAFT: 'Bản nháp',
  PUBLISHED: 'Đã xuất bản',
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
};

export function normalizeBlogStatus(status) {
  return String(status ?? 'DRAFT').toUpperCase();
}

export function mapBlogRow(blog) {
  return {
    id: blog.id,
    title: blog.title ?? '',
    slug: blog.slug ?? '',
    excerpt: blog.excerpt ?? '',
    contentHtml: blog.contentHtml ?? '',
    thumbnailUrl: normalizeStoredUploadFilename(blog.thumbnailUrl),
    status: normalizeBlogStatus(blog.status),
    categoryId: blog.category?.id ?? blog.categoryId ?? '',
    categoryName: blog.category?.name ?? 'Chưa phân loại',
    publishedAt: blog.publishedAt ?? null,
    createdAt: blog.createdAt ?? null,
    updatedAt: blog.updatedAt ?? null,
    authorEmail: blog.author?.email ?? '',
  };
}

export function formatBlogDate(value) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function buildBlogPayload(values) {
  const body = {
    title: values.title.trim(),
    slug: values.slug.trim(),
    excerpt: values.excerpt.trim(),
    contentHtml: values.contentHtml.trim(),
    thumbnailUrl: values.thumbnailUrl.trim(),
    status: values.status,
  };

  if (values.categoryId) {
    body.categoryId = values.categoryId;
  }

  return body;
}
