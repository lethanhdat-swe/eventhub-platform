import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlogItem from '../../../components/BlogItem/BlogItem';

function BlogRelated({ relatedBlogs = [] }) {
  if (!relatedBlogs.length) return null;

  return (
    <section className="mt-16 border-t border-(--border-color) pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-(--primary-color)">
            <Sparkles size={16} />
            <p className="text-xs font-black uppercase tracking-[0.24em]">
              Gợi ý cho bạn
            </p>
          </div>

          <h2 className="text-2xl font-black tracking-[-0.035em] text-(--text-primary) md:text-3xl">
            Bài viết liên quan
          </h2>
        </div>

        <Link
          to="/blogs"
          className="
            group inline-flex items-center gap-2 rounded-full
            border border-(--border-color)
            bg-(--soft-surface-color) px-5 py-3
            text-sm font-black text-(--text-primary)
            transition-all duration-300
            hover:-translate-y-0.5
            hover:border-(--primary-color)/55
            hover:bg-(--primary-color)
            hover:text-white
            active:scale-95
          "
        >
          Xem tất cả
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {relatedBlogs.slice(0, 2).map((blog) => (
          <BlogItem key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}

export default BlogRelated;
