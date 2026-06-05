import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/assets/icons';
import { CalendarDays, Link as LinkIcon } from 'lucide-react';

function BlogMeta({ blog }) {
  const shareItems = [
    { id: 'facebook', Icon: FacebookIcon, label: 'Facebook' },
    { id: 'instagram', Icon: InstagramIcon, label: 'Instagram' },
    { id: 'twitter', Icon: TwitterIcon, label: 'Twitter' },
    { id: 'copy-link', Icon: LinkIcon, label: 'Sao chép liên kết' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-5 my-7">
      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-(--muted-text)">
        <div className="flex items-center gap-2 rounded-full border border-(--border-color) bg-(--soft-surface-color) px-4 py-2.5">
          <CalendarDays size={17} className="text-(--text-primary)" />
          <span>{blog.date}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-(--muted-text)">
          Chia sẻ
        </span>

        <div className="flex items-center gap-2">
          {shareItems.map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              className="
                flex size-10 items-center justify-center rounded-full
                border border-(--border-color)
                bg-(--soft-surface-color)
                text-(--text-primary)
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-(--primary-color)/55
                hover:bg-(--primary-color)
                hover:text-white
                active:scale-95
              "
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogMeta;
