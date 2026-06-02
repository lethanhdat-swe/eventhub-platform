import { Button } from '@/components/ui/button';

function BlogsError({ error, onRetry }) {
  if (!error) return null;

  return (
    <div
      className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5"
      role="alert"
    >
      <p className="text-sm text-destructive">{error}</p>

      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
      >
        Thử lại
      </Button>
    </div>
  );
}

export default BlogsError;