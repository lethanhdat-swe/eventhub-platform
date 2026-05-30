import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

import { images } from '@/assets';
import Pagination from '@/components/Pagination/Pagination';
import {
  fadeInVariants,
  fadeUpVariants,
  motionTransition,
  staggerContainerVariants,
} from '@/constants/motion';
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
  }, [currentPage, selectedCategory]);

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
            className="
              flex min-h-[220px] items-center justify-center rounded-[24px]
              border border-dashed border-red-400/30 bg-red-400/5
              px-5 text-center
            "
          >
            <p className="text-sm font-semibold text-red-400">{error}</p>
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
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="show"
            className="
              flex min-h-[220px] items-center justify-center rounded-[24px]
              border border-dashed border-[var(--border-color)]
              bg-[var(--soft-surface-color)]
              px-5 text-center
            "
          >
            <p className="text-sm font-medium text-[var(--muted-text)]">
              No blogs found.
            </p>
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
        overflow-hidden rounded-[24px] border border-[var(--border-color)]
        bg-[var(--card-surface-color)] shadow-[0_18px_50px_rgba(0,0,0,0.12)]
        backdrop-blur-xl
      "
    >
      <div className="grid gap-0 md:grid-cols-[280px_1fr]">
        <div className="h-56 animate-pulse bg-[var(--background-color)] md:h-full" />

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <div className="h-7 w-24 animate-pulse rounded-full bg-[var(--background-color)]" />
            <div className="h-4 w-20 animate-pulse rounded-lg bg-[var(--background-color)]" />
          </div>

          <div className="space-y-2">
            <div className="h-6 w-4/5 animate-pulse rounded-lg bg-[var(--background-color)]" />
            <div className="h-6 w-3/5 animate-pulse rounded-lg bg-[var(--background-color)]" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-lg bg-[var(--background-color)]" />
            <div className="h-4 w-5/6 animate-pulse rounded-lg bg-[var(--background-color)]" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="h-9 w-28 animate-pulse rounded-full bg-[var(--background-color)]" />
            <div className="h-5 w-20 animate-pulse rounded-lg bg-[var(--background-color)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
