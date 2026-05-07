import { useState } from "react";
import BlogFilter from "./components/BlogFilter/BlogFilter";
import BlogHero from "./components/BlogHero/BlogHero";
import BlogItem from "./components/BlogItem/BlogItem";
import { blogData } from "./data";
import Pagination from '@/components/Pagination/Pagination';

function Blog() {
    const [currentPage, setCurrentPage] = useState(
        blogData.pagination.currentPage
      );
      const { itemsPerPage, totalPages } = blogData.pagination;
      const start = (currentPage - 1) * itemsPerPage;
      const currentBlogs = blogData.blogs.slice(start, start + itemsPerPage);

      const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return ( 
        <div className="pt-(--header-height)">
            <BlogHero />
            <BlogFilter />
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