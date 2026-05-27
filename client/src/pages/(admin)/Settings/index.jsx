
import PageHeader from '@/pages/(admin)/components/PageHeader';

import PlatformSettingsSection from './components/PlatformSettingsSection/PlatformSettingsSection';
import BannerUploadsField from './components/BannerUploadsField/BannerUploadsField';
import SettingsSectionCard from './components/SettingsSectionCard/SettingsSectionCard';

function Settings() {

  return (
    <div className="space-y-4">
      <PageHeader
        title="Cấu hình hệ thống"
        description="Thiết lập thông tin nền tảng, thanh toán, email và quy tắc vận hành."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlatformSettingsSection/>

        <SettingsSectionCard title="Banner website">
          <BannerUploadsField />
        </SettingsSectionCard>
      </div>

    </div>
  );
}

export default Settings;