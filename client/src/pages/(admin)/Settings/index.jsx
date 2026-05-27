import {useState } from 'react';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import { cloneDefaultSettings, DEFAULT_SETTINGS } from '@/pages/(admin)/Settings/data';

import PlatformSettingsSection from './components/PlatformSettingsSection/PlatformSettingsSection';
import PaymentSettingsSection from './components/PaymentSettingsSection/PaymentSettingsSection';
import TicketSettingsSection from './components/TicketSettingsSection/TicketSettingsSection';
import EmailSettingsSection from './components/EmailSettingsSection/EmailSettingsSection';
import AppearanceSettingsSection from './components/AppearanceSettingsSection/AppearanceSettingsSection';
import SettingsActions from './components/SettingsActions/SettingsActions';
import BannerUploadsField from './components/BannerUploadsField/BannerUploadsField';
import SettingsSectionCard from './components/SettingsSectionCard/SettingsSectionCard';

function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Lưu cấu hình:', settings);
  };

  const handleReset = () => {
    setSettings(cloneDefaultSettings());
  };

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

        <PaymentSettingsSection settings={settings} update={update} />
        <TicketSettingsSection settings={settings} update={update} />
        <EmailSettingsSection settings={settings} update={update} />
        <AppearanceSettingsSection settings={settings} update={update} />
      </div>

      <SettingsActions onSave={handleSave} onReset={handleReset} />
    </div>
  );
}

export default Settings;