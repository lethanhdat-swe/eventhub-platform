import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThumbnailUploadField } from '@/components/form';
import { siteSettingService } from '@/lib/services/siteSetting/siteSettingService';
import SettingsSectionCard from '../SettingsSectionCard/SettingsSectionCard';
import SettingsField from '../SettingsField/SettingsField';

const DEFAULT_FORM = {
  websiteName: '',
  logoUrl: '',
  address: '',
  hotline: '',
  supportEmail: '',
  startTime: '08:00',
  endTime: '18:00',
  mapUrl: '',
};

// "08:00 - 18:00" → { startTime: "08:00", endTime: "18:00" }
const parseWorkingHours = (workingHours = '') => {
  const [start, end] = workingHours.split(' - ');
  return {
    startTime: start?.trim() || '08:00',
    endTime: end?.trim() || '18:00',
  };
};

// { startTime, endTime } → "08:00 - 18:00"
const formatWorkingHours = (startTime, endTime) => `${startTime} - ${endTime}`;

function PlatformSettingsSection() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [settingId, setSettingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSiteSetting = async () => {
      try {
        const data = await siteSettingService.getSiteSetting();
        if (data) {
          setSettingId(data.id);
          setForm({
            websiteName: data.websiteName || '',
            logoUrl: data.logoUrl || '',
            address: data.address || '',
            hotline: data.hotline || '',
            supportEmail: data.supportEmail || '',
            mapUrl: data.mapUrl || '',
            ...parseWorkingHours(data.workingHours),
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSiteSetting();
  }, []);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const payload = {
        websiteName: form.websiteName,
        logoUrl: form.logoUrl,
        address: form.address,
        hotline: form.hotline,
        supportEmail: form.supportEmail,
        mapUrl: form.mapUrl,
        workingHours: formatWorkingHours(form.startTime, form.endTime),
      };

      if (settingId) {
        await siteSettingService.updateSiteSetting(payload);
      } else {
        const created = await siteSettingService.createSiteSetting(payload);
        console.log('create: ',created)
        if (created?.id) setSettingId(created.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!settingId) return;
    try {
      await siteSettingService.deleteSiteSetting();
      setForm(DEFAULT_FORM);
      setSettingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SettingsSectionCard title="Thông tin nền tảng">
      <SettingsField label="Tên website" htmlFor="site-name">
        <Input
          id="site-name"
          value={form.websiteName}
          onChange={(e) => update('websiteName', e.target.value)}
          className="h-9"
        />
      </SettingsField>

      <SettingsField label="Email hỗ trợ" htmlFor="support-email">
        <Input
          id="support-email"
          type="email"
          value={form.supportEmail}
          onChange={(e) => update('supportEmail', e.target.value)}
          className="h-9"
        />
      </SettingsField>

      <SettingsField label="Hotline" htmlFor="hotline">
        <Input
          id="hotline"
          value={form.hotline}
          onChange={(e) => update('hotline', e.target.value)}
          className="h-9"
        />
      </SettingsField>

      <SettingsField label="Địa chỉ công ty" htmlFor="company-address">
        <Input
          id="company-address"
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
          className="h-9"
        />
      </SettingsField>

      <SettingsField label="Logo website">
        <ThumbnailUploadField
          value={form.logoUrl}
          onChange={(value) => update('logoUrl', value)}
        />
      </SettingsField>

      <SettingsField label="Google Map URL" htmlFor="map-url">
        <Input
          id="map-url"
          value={form.mapUrl}
          onChange={(e) => update('mapUrl', e.target.value)}
          placeholder="https://maps.google.com/..."
          className="h-9"
        />
      </SettingsField>

      <SettingsField label="Giờ làm việc">
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={form.startTime}
            onChange={(e) => update('startTime', e.target.value)}
            className="w-32 h-9"
          />
          <span className="text-sm text-muted-foreground">đến</span>
          <Input
            type="time"
            value={form.endTime}
            onChange={(e) => update('endTime', e.target.value)}
            className="w-32 h-9"
          />
        </div>
      </SettingsField>

      <div className="flex justify-end gap-2 pt-2">
        {settingId && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Xóa cấu hình
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
        </Button>
      </div>
    </SettingsSectionCard>
  );
}

export default PlatformSettingsSection;