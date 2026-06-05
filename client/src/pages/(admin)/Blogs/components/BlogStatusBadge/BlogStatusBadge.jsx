import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  BLOG_STATUS_LABELS,
  normalizeBlogStatus,
} from '@/pages/(admin)/Blogs/data';

function BlogStatusBadge({ status }) {
  const normalizedStatus = normalizeBlogStatus(status);
  const isPublished = normalizedStatus === 'PUBLISHED';

  return (
    <Badge
      variant="outline"
      className={cn(
        'h-5 rounded-md px-1.5 text-xs font-medium',
        isPublished
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
      )}
    >
      {BLOG_STATUS_LABELS[normalizedStatus] ?? normalizedStatus}
    </Badge>
  );
}

export default BlogStatusBadge;
