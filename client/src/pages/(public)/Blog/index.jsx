import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

import { images } from '@/assets';
import Pagination from '@/components/Pagination/Pagination';
import PublicStatePanel from '@/components/PublicStatePanel/PublicStatePanel';
import {
  fadeInVariants,
  fadeUpVariants,
  motionTransition,
  staggerContainerVariants,
} from '@/constants/motion';
import { parseApiError } from '@/lib/http/apiError';
import { blogService } from '@/lib/services/blog/blogService';
import { blogCategoryService } from '@/lib/services/blogCategory/blogCategoryService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

import BlogFilter from './components/BlogFilter/BlogFilter';
import BlogHero from './components/BlogHero/BlogHero';
import BlogItem from './components/BlogItem/BlogItem';

const ITEMS_PER_PAGE = 4;
const ALL_CATEGORY_ID = 'all';

function formatBlogDate(value) {
  if (!value) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function normalizeBlog(blog) {
  return {
    ...blog,
    id: blog.id,
    category: blog.category?.name ?? 'Chưa phân loại',
    date: formatBlogDate(blog.publishedAt ?? blog.createdAt),
    excerpt: blog.excerpt ?? '',
    image:
      (blog.thumbnailUrl
        ? resolvePublicAssetUrl(blog.thumbnailUrl, '')
        : '') || images.home,
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
  const [reloadToken, setReloadToken] = useState(0);

  const filterCategories = useMemo(
    () => [
      { id: ALL_CATEGORY_ID, label: 'Tất cả' },
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
  }, [currentPage, selectedCategory, reloadToken]);

  const handleRetry = () => {
    setReloadToken((token) => token + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="mb-10">
      <BlogHero />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariants}
      >
        <BlogFilter
          categories={filterCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </motion.div>

      <section className="container mt-8">
        {isLoading ? (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <motion.div key={index} variants={fadeUpVariants}>
                <BlogItemSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              y: motionTransition.smooth,
              opacity: motionTransition.opacity,
            }}
          >
            <PublicStatePanel
              variant="error"
              description={error}
              onRetry={handleRetry}
            />
          </motion.div>
        ) : blogs.length > 0 ? (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {blogs.map((blog, index) => {
              const delay = Math.min(index * 0.1, 0.4);

              return (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    x: {
                      ...motionTransition.smooth,
                      delay,
                    },
                    opacity: {
                      ...motionTransition.opacity,
                      delay,
                    },
                  }}
                >
                  <BlogItem blog={blog} />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div variants={fadeInVariants} initial="hidden" animate="show">
            <PublicStatePanel
              title="Không tìm thấy bài viết"
              description="Chưa có bài viết trong danh mục này. Hãy thử chọn danh mục khác."
            />
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-8"
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </section>
    </div>
  );
}

function BlogItemSkeleton() {
  return (
    <div
      className="
        overflow-hidden rounded-[24px] border border-(--border-color)
        bg-(--card-surface-color) shadow-[0_18px_50px_rgba(0,0,0,0.12)]
        backdrop-blur-xl
      "
    >
      <div className="grid gap-0 md:grid-cols-[280px_1fr]">
        <div className="h-56 animate-pulse bg-(--background-color) md:h-full" />

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-24 animate-pulse rounded-full bg-(--background-color)" />
            <div className="h-4 w-20 animate-pulse rounded-lg bg-(--background-color)" />
          </div>

          <div className="space-y-2">
            <div className="h-6 w-4/5 animate-pulse rounded-lg bg-(--background-color)" />
            <div className="h-6 w-3/5 animate-pulse rounded-lg bg-(--background-color)" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-lg bg-(--background-color)" />
            <div className="h-4 w-5/6 animate-pulse rounded-lg bg-(--background-color)" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="h-9 w-28 animate-pulse rounded-full bg-(--background-color)" />
            <div className="h-5 w-20 animate-pulse rounded-lg bg-(--background-color)" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
