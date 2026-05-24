import { useEffect, useState } from "react";
import {useParams } from "react-router-dom";
import { images } from "@/assets";
import { parseApiError } from "@/lib/http/apiError";
import { blogService } from "@/lib/services/blog/blogService";
import { getUploadPreviewSrc } from "@/lib/upload/uploadAsset";
import BackButton from "./components/BackButton/BackButton";
import BlogMeta from "./components/BlogMeta/BlogMeta";
import BlogTitle from "./components/BlogTitle/BlogTitle";
import BlogContent from "./components/BlogContent/BlogContent";
import FeedbackActions from "./components/FeedbackActions/FeedbackActions";
import BlogRelated from "./components/BlogRelated/BlogRelated";

function formatBlogDate(value) {
    if (!value) return "";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function normalizeBlog(blog) {
    return {
        ...blog,
        category: blog.category?.name ?? "Uncategorized",
        date: formatBlogDate(blog.publishedAt ?? blog.createdAt),
        excerpt: blog.excerpt ?? "",
        image: getUploadPreviewSrc(blog.thumbnailUrl) || images.home,
        views: blog.views ?? 0,
        readTime: blog.readTime ?? "5 min read",
        content: blog.content ?? {
            intro: blog.excerpt ?? "",
            sections: [],
        },
    };
}

function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function loadBlogDetail() {
            setIsLoading(true);
            setError(null);

            try {
                const [blogPayload, listPayload] = await Promise.all([
                    blogService.getBySlug(id),
                    blogService.list({ page: 1, limit: 3 }),
                ]);

                if (ignore) return;

                setBlog(normalizeBlog(blogPayload));
                setRelatedBlogs(
                    (listPayload.items ?? [])
                        .filter((item) => item.id !== blogPayload.id)
                        .slice(0, 2)
                        .map(normalizeBlog)
                );
            } catch (err) {
                if (!ignore) setError(parseApiError(err).message);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }

        void loadBlogDetail();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (isLoading) {
        return <div className="pt-(--header-height) p-10 text-(--text-primary)/70">Loading blog...</div>;
    }

    if (error || !blog) {
        return <div className="pt-(--header-height) p-10 text-red-400">{error || "Blog not found"}</div>;
    }

    return (
        <div className="pt-(--header-height) p-10">
           <BackButton />
           <BlogTitle blog={blog}/>
           <BlogMeta blog={blog}/>
           <BlogContent blog={blog} />
           <FeedbackActions />
            <BlogRelated relatedBlogs={relatedBlogs}/>
        </div>
      );
}

export default BlogDetail;