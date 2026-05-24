import { useEffect, useMemo, useState } from 'react';
import { images } from '@/assets';
import Pagination from '@/components/Pagination/Pagination';
import { parseApiError } from '@/lib/http/apiError';
import { blogService } from '@/lib/services/blog/blogService';
import { blogCategoryService } from '@/lib/services/blogCategory/blogCategoryService';
import { getUploadPreviewSrc } from '@/lib/upload/uploadAsset';
import BlogFilter from './components/BlogFilter/BlogFilter';
import BlogHero from './components/BlogHero/BlogHero';
import BlogItem from './components/BlogItem/BlogItem';

const ITEMS_PER_PAGE = 4;
const ALL_CATEGORY_ID = 'all';

function formatBlogDate(value) {
  if (!value) return '';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function normalizeBlog(blog) {
  return {
    ...blog,
    id: blog.id,
    category: blog.category?.name ?? 'Uncategorized',
    date: formatBlogDate(blog.publishedAt ?? blog.createdAt),
    excerpt: blog.excerpt ?? '',
    image: getUploadPreviewSrc(blog.thumbnailUrl) || images.home,
    views: blog.views ?? 0,
  };
}

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterCategories = useMemo(
    () => [
      { id: ALL_CATEGORY_ID, label: 'All' },
      ...categories.map((category) => ({
        id: category.id,
        label: category.name,
      })),
    ],
    [categories]
  );

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const payload = await blogCategoryService.list({ page: 1, limit: 100 });
        if (!ignore) setCategories(payload.items ?? []);
      } catch {
        if (!ignore) setCategories([]);
      }
    }

    void loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadBlogs() {
      setIsLoading(true);
      setError(null);

      try {
        const query = { page: currentPage, limit: ITEMS_PER_PAGE };
        const payload =
          selectedCategory === ALL_CATEGORY_ID
            ? await blogService.list(query)
            : await blogService.getByCategoryId(selectedCategory, query);

        if (ignore) return;

        setBlogs((payload.items ?? []).map(normalizeBlog));
        setTotalPages(Math.max(1, payload.meta?.totalPages ?? 1));
      } catch (err) {
        if (ignore) return;

        setBlogs([]);
        setTotalPages(1);
        setError(parseApiError(err).message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadBlogs();

    return () => {
      ignore = true;
    };
  }, [currentPage, selectedCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="pt-(--header-height) mb-10">
      <BlogHero />
      <BlogFilter
        categories={filterCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      {isLoading ? (
        <p className="container mt-8 text-center text-(--text-primary)/70">
          Loading blogs...
        </p>
      ) : error ? (
        <p className="container mt-8 text-center text-red-400">{error}</p>
      ) : blogs.length > 0 ? (
        blogs.map((blog) => <BlogItem key={blog.id} blog={blog} />)
      ) : (
        <p className="container mt-8 text-center text-(--text-primary)/70">
          No blogs found.
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Blog;
