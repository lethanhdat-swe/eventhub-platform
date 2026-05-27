import { useEffect, useState } from 'react';
import { Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteSettingService } from '@/lib/services/siteSetting/siteSettingService';
import { getUploadPreviewSrc } from '@/lib/upload/uploadAsset';

function HeaderLogo({ scrolled }) {
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
    <div className="flex items-center gap-2">
      {siteSetting.logoUrl ? (
        <img
          src={getUploadPreviewSrc(siteSetting.logoUrl)}
          alt={siteSetting.websiteName}
          className="object-contain w-15 h-15"
        />
      ) : (
        <Sparkle color="var(--primary-color)" />
      )}

      <Link
        to="/"
        className={`
          text-xl font-bold transition-colors duration-300
          ${scrolled ? 'text-(--text-primary)' : 'text-white'}
        `}
      >
        {siteSetting.websiteName}
      </Link>
    </div>
  );
}

export default HeaderLogo;