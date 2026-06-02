import { useEffect, useState } from 'react';
import { Sparkle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { siteSettingService } from '@/lib/services/siteSetting/siteSettingService';
import { getUploadPreviewSrc } from '@/lib/upload/uploadAsset';

function HeaderLogo({ scrolled }) {
  const [siteSetting, setSiteSetting] = useState({ websiteName: 'EventHub', logoUrl: '' });
  const { pathname } = useLocation();
  const DARK_HERO_ROUTES = ['/', '/events', '/blogs', '/contact', '/search'];
  const isDarkHero = DARK_HERO_ROUTES.includes(pathname);

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
    <div className="flex items-center gap-2">
      {siteSetting.logoUrl ? (
        <img
          src={getUploadPreviewSrc(siteSetting.logoUrl)}
          alt={siteSetting.websiteName}
          className="object-contain w-8 h-8 lg:w-10 lg:h-10"
        />
      ) : (
        <Sparkle color="var(--primary-color)" />
      )}

      <Link
        to="/"
        className={`
          text-xl font-bold transition-colors duration-300
          ${isDarkHero && !scrolled ? 'text-white' : 'text-(--text-primary)'}
        `}
      >
        {siteSetting.websiteName}
      </Link>
    </div>
  );
}

export default HeaderLogo;