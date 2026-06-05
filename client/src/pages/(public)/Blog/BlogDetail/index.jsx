import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { images } from '@/assets';
import { parseApiError } from '@/lib/http/apiError';
import { blogService } from '@/lib/services/blog/blogService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import BackButton from './components/BackButton/BackButton';
import BlogMeta from './components/BlogMeta/BlogMeta';
import BlogTitle from './components/BlogTitle/BlogTitle';
import BlogContent from './components/BlogContent/BlogContent';
import BlogRelated from './components/BlogRelated/BlogRelated';

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
        category: blog.category?.name ?? 'Uncategorized',
        date: formatBlogDate(blog.publishedAt ?? blog.createdAt),
        excerpt: blog.excerpt ?? '',
        image:
            (blog.thumbnailUrl
                ? resolvePublicAssetUrl(blog.thumbnailUrl, '')
                : '') || images.home,
        views: blog.views ?? 0,
        content: blog.content ?? {
            intro: blog.excerpt ?? '',
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
        return <BlogDetailSkeleton />;
    }

    if (error || !blog) {
        return (
            <div className="pt-(--header-height) p-10 text-red-400">
                {error || 'Blog not found'}
            </div>
        );
    }

    return (
        <div className="pt-(--header-height) container py-10">
            <BackButton />
            <BlogTitle blog={blog} />
            <BlogMeta blog={blog} />
            <BlogContent blog={blog} />
            <BlogRelated relatedBlogs={relatedBlogs} />
        </div>
    );
}

function BlogDetailSkeleton() {
    return (
        <div className="pt-(--header-height) container py-10">
            <BackButton />

            <div className="max-w-6xl mt-10">
                <div className="mb-5 h-8 w-28 animate-pulse rounded-full bg-(--background-color)" />
                <div className="space-y-3">
                    <div className="h-11 w-full animate-pulse rounded-xl bg-(--background-color) md:h-14" />
                    <div className="h-11 w-4/5 animate-pulse rounded-xl bg-(--background-color) md:h-14" />
                </div>
            </div>

            <div className="my-7 flex flex-wrap items-center justify-between gap-5">
                <div className="h-10 w-40 animate-pulse rounded-full bg-(--background-color)" />
                <div className="flex items-center gap-3">
                    <div className="h-5 w-14 animate-pulse rounded-lg bg-(--background-color)" />
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="size-10 animate-pulse rounded-full bg-(--background-color)"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mt-5">
                <div
                    className="
                        h-52 w-full animate-pulse rounded-xl
                        bg-(--background-color) sm:h-80 md:h-110 lg:h-137.5
                        sm:rounded-2xl
                    "
                />

                <div className="space-y-4 pt-6 sm:pt-8 md:pt-10">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-5 animate-pulse rounded-lg bg-(--background-color)"
                            style={{ width: `${100 - index * 8}%` }}
                        />
                    ))}
                    <div className="h-5 w-2/3 animate-pulse rounded-lg bg-(--background-color)" />
                </div>
            </div>

            <section className="mt-16 border-t border-(--border-color) pt-10">
                <div className="mb-8 space-y-3">
                    <div className="h-4 w-32 animate-pulse rounded-lg bg-(--background-color)" />
                    <div className="h-9 w-56 animate-pulse rounded-xl bg-(--background-color)" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="
                                overflow-hidden rounded-[24px] border border-(--border-color)
                                bg-(--card-surface-color) shadow-[0_18px_50px_rgba(0,0,0,0.12)]
                                backdrop-blur-xl
                            "
                        >
                            <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                                <div className="h-56 animate-pulse bg-(--background-color) md:h-full" />
                                <div className="space-y-4 p-5">
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default BlogDetail;
