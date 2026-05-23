import { useState } from 'react';
import BlogFilter from './components/BlogFilter/BlogFilter';
import BlogHero from './components/BlogHero/BlogHero';
import BlogItem from './components/BlogItem/BlogItem';
import { blogData } from './data';
import Pagination from '@/components/Pagination/Pagination';

function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(
    blogData.pagination.currentPage
  );

  const mapCategoryLabelToValue = (label) => {
    const norm = label.toLowerCase();
    if (norm === 'all') return 'all';
    if (norm === 'news') return 'news';
    if (norm === 'event reviews') return 'event reviews';
    if (norm === 'guides') return 'guides';
    if (norm === 'interview') return 'interviews';
    if (norm === 'tip & tricks') return 'tips & tricks';
    return norm;
  };

  const filteredBlogs =
    selectedCategory === 'All'
      ? blogData.blogs
      : blogData.blogs.filter(
          (blog) =>
            blog.category.toLowerCase() ===
            mapCategoryLabelToValue(selectedCategory)
        );

  const itemsPerPage = blogData.pagination.itemsPerPage;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage)
  );
  const start = (currentPage - 1) * itemsPerPage;
  const currentBlogs = filteredBlogs.slice(start, start + itemsPerPage);

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
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      {currentBlogs.map((blog) => (
        <BlogItem key={blog.id} blog={blog} />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Blog;
