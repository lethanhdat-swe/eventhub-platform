import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@/assets/icons';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function BrandLogo() {
  const socialIcons = [
    { id: 'facebook', Icon: FacebookIcon, label: 'Facebook' },
    { id: 'instagram', Icon: InstagramIcon, label: 'Instagram' },
    { id: 'twitter', Icon: TwitterIcon, label: 'Twitter' },
    { id: 'tiktok', Icon: TikTokIcon, label: 'TikTok' },
    { id: 'youtube', Icon: YoutubeIcon, label: 'YouTube' },
  ];

  return (
    <div>
      <Link
        to="/"
        className="group inline-flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5"
      >
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--primary-color)]/12 text-[var(--primary-color)]">
          <Sparkles
            size={22}
            className="transition-transform duration-300 group-hover:rotate-12"
          />
        </div>

        <span className="text-2xl font-black tracking-[-0.04em] text-[var(--text-primary)]">
          EventHub
        </span>
      </Link>

      <p className="mt-5 max-w-xs text-sm font-medium leading-7 text-[var(--muted-text)]">
        Nền tảng giúp bạn khám phá sự kiện, đặt vé nhanh chóng và lưu giữ những
        trải nghiệm đáng nhớ.
      </p>

      <div className="mt-6 flex items-center gap-3">
        {socialIcons.map(({ id, Icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            className="
              flex size-10 items-center justify-center rounded-full
              border border-[var(--border-color)]
              bg-[var(--soft-surface-color)]
              text-[var(--text-primary)]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-[var(--primary-color)]/55
              hover:bg-[var(--primary-color)]
              hover:text-white
              active:scale-95
            "
          >
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

export default BrandLogo;
