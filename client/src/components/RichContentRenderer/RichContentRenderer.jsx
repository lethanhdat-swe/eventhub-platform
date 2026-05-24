import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

function RichContentRenderer({ html, className = '' }) {
  const safeHtml = DOMPurify.sanitize(html || '');

  if (!safeHtml) return null;

  return (
    <article
      className={cn(
        'eventhub-rich-content mantine-RichTextEditor-Typography m_d08caa0 mantine-Typography-root',
        className
      )}
    >
      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </article>
  );
}

export default RichContentRenderer;
