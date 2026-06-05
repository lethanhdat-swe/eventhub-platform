export function mapBlogCategoryRow(category) {
  return {
    id: category.id,
    name: category.name ?? '',
    slug: category.slug ?? '',
    createdAt: category.createdAt ?? null,
  };
}

export function formatBlogCategoryDate(value) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
