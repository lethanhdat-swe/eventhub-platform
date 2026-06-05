import RichContentRenderer from '@/components/RichContentRenderer/RichContentRenderer';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { Dot } from 'lucide-react';

function BlogContent({ blog }) {
  return (
    <div className="mt-4 sm:mt-5">
      <div className="w-full h-52 sm:h-80 md:h-110 lg:h-137.5 overflow-hidden rounded-xl sm:rounded-2xl">
        <img
          src={resolvePublicAssetUrl(blog.thumbnailUrl)}
          alt={blog.title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="pt-6 sm:pt-8 md:pt-10">
        {blog.contentHtml ? (
          <RichContentRenderer html={blog.contentHtml} />
        ) : (
          <>
            <p className="text-(--text-primary)/60 text-base sm:text-lg md:text-xl leading-7 sm:leading-8">
              {blog.content.intro}
            </p>

            <div className="mt-6 sm:mt-8 md:mt-10">
              {blog.content.sections.map((section, id) => (
                <div key={id} className="mb-7 sm:mb-10">
                  <h1 className="text-(--text-primary) text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                    {section.heading}
                  </h1>
                  <p className="text-(--text-primary)/60 text-sm sm:text-lg md:text-xl leading-7 mb-2">
                    {section.body}
                  </p>

                  <ul className="mt-1">
                    {section.bullets.map((bullet, id) => (
                      <li key={id} className="flex items-start gap-1 sm:items-center sm:gap-3">
                        <Dot size={36} className="sm:hidden shrink-0 mt-0.5" color="var(--primary-color)" />
                        <Dot size={50} className="hidden sm:block shrink-0" color="var(--primary-color)" />
                        <p className="text-(--text-primary) text-sm sm:text-lg md:text-xl">
                          {bullet.label}
                        </p>
                        <p className="text-(--text-primary)/60 text-sm sm:text-lg md:text-xl">
                          - {bullet.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BlogContent;