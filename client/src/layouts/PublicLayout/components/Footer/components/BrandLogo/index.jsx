import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@/assets/icons';
import { siteSettingService } from '@/lib/services/siteSetting';
import { getUploadPreviewSrc } from '@/lib/upload/uploadAsset';
import { Sparkle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BrandLogo() {
  const socialIcons = [
    { id: 'facebook', Icon: FacebookIcon, label: 'Facebook' },
    { id: 'instagram', Icon: InstagramIcon, label: 'Instagram' },
    { id: 'twitter', Icon: TwitterIcon, label: 'Twitter' },
    { id: 'tiktok', Icon: TikTokIcon, label: 'TikTok' },
    { id: 'youtube', Icon: YoutubeIcon, label: 'YouTube' },
  ];
  const [siteSetting, setSiteSetting] = useState({ websiteName: 'EventHub', logoUrl: '' });
  
    useEffect(() => {
      const fetchSiteSetting = async () => {
        try {
          const data = await siteSettingService.getSiteSetting();
          if (data) setSiteSetting(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchSiteSetting();
    }, []);

   return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <Link
        to="/"
        className="group inline-flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5"
      >
        {siteSetting.logoUrl ? (
          <img
            src={getUploadPreviewSrc(siteSetting.logoUrl)}
            alt={siteSetting.websiteName}
            className="object-contain w-8 h-8 lg:w-10 lg:h-10"
          />
        ) : (
          <Sparkle color="var(--primary-color)" />
        )}
        <span className="text-2xl font-black tracking-[-0.04em] text-(--text-primary)">
          {siteSetting.websiteName}
        </span>
      </Link>

      <p className="mt-4 max-w-xs text-sm font-medium leading-7 text-(--muted-text)">
        Nền tảng giúp bạn khám phá sự kiện, đặt vé nhanh chóng và lưu giữ những
        trải nghiệm đáng nhớ.
      </p>

      {/* flex-wrap để icons không tràn trên mobile nhỏ */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {socialIcons.map(({ id, Icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            className="
              flex size-9 items-center justify-center rounded-full
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
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

export default BrandLogo;
