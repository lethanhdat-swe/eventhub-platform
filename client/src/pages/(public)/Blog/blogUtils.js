export function filterPublishedBlogs(items = []) {
  return items.filter((item) => item.status === 'PUBLISHED');
}
