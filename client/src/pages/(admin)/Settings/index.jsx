import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import SettingsSectionCard from '@/pages/(admin)/Settings/components/SettingsSectionCard';
import {
  cloneDefaultSettings,
  DEFAULT_SETTINGS,
  SETTINGS_LANGUAGE_OPTIONS,
  SETTINGS_PAYMENT_OPTIONS,
  SETTINGS_THEME_OPTIONS,
} from '@/pages/(admin)/Settings/data';

function SettingsField({ label, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function SettingsCheckboxField({ id, label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {label}
      </Label>
    </div>
  );
}

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
        <SettingsSectionCard title="Thông tin nền tảng">
          <SettingsField label="Tên website" htmlFor="site-name">
            <Input
              id="site-name"
              value={settings.siteName}
              onChange={(event) => update('siteName', event.target.value)}
              className="h-9"
            />
          </SettingsField>
          <SettingsField label="Email hỗ trợ" htmlFor="support-email">
            <Input
              id="support-email"
              type="email"
              value={settings.supportEmail}
              onChange={(event) => update('supportEmail', event.target.value)}
              className="h-9"
            />
          </SettingsField>
          <SettingsField label="Hotline" htmlFor="hotline">
            <Input
              id="hotline"
              value={settings.hotline}
              onChange={(event) => update('hotline', event.target.value)}
              className="h-9"
            />
          </SettingsField>
          <SettingsField label="Địa chỉ công ty" htmlFor="company-address">
            <Input
              id="company-address"
              value={settings.companyAddress}
              onChange={(event) => update('companyAddress', event.target.value)}
              className="h-9"
            />
          </SettingsField>
        </SettingsSectionCard>

        <SettingsSectionCard title="Thanh toán">
          <SettingsField
            label="Phương thức thanh toán mặc định"
            htmlFor="payment-method"
          >
            <Select
              value={settings.defaultPaymentMethod}
              onValueChange={(value) =>
                update('defaultPaymentMethod', value ?? 'SEPAY')
              }
            >
              <SelectTrigger id="payment-method" className="h-9 w-full">
                <SelectValue placeholder="Chọn phương thức" />
              </SelectTrigger>
              <SelectContent>
                {SETTINGS_PAYMENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsField>
          <SettingsCheckboxField
            id="auto-confirm-payment"
            label="Tự động xác nhận thanh toán"
            checked={settings.autoConfirmPayment}
            onCheckedChange={(checked) => update('autoConfirmPayment', checked)}
          />
          <SettingsField label="Thời gian giữ ghế (phút)" htmlFor="seat-hold">
            <Input
              id="seat-hold"
              type="number"
              min={1}
              value={settings.seatHoldMinutes}
              onChange={(event) =>
                update('seatHoldMinutes', Number(event.target.value))
              }
              className="h-9"
            />
          </SettingsField>
        </SettingsSectionCard>

        <SettingsSectionCard title="Vé & QR">
          <SettingsCheckboxField
            id="allow-duplicate-checkin"
            label="Cho phép check-in trùng"
            checked={settings.allowDuplicateCheckIn}
            onCheckedChange={(checked) =>
              update('allowDuplicateCheckIn', checked)
            }
          />
          <SettingsField label="Thời gian hiệu lực QR (giờ)" htmlFor="qr-validity">
            <Input
              id="qr-validity"
              type="number"
              min={1}
              value={settings.qrValidityHours}
              onChange={(event) =>
                update('qrValidityHours', Number(event.target.value))
              }
              className="h-9"
            />
          </SettingsField>
          <SettingsField label="Prefix mã vé" htmlFor="ticket-prefix">
            <Input
              id="ticket-prefix"
              value={settings.ticketCodePrefix}
              onChange={(event) =>
                update('ticketCodePrefix', event.target.value)
              }
              className="h-9 uppercase"
            />
          </SettingsField>
        </SettingsSectionCard>

        <SettingsSectionCard title="Email & thông báo">
          <SettingsCheckboxField
            id="email-ticket-confirmation"
            label="Bật email xác nhận vé"
            checked={settings.emailTicketConfirmation}
            onCheckedChange={(checked) =>
              update('emailTicketConfirmation', checked)
            }
          />
          <SettingsCheckboxField
            id="email-event-reminder"
            label="Bật nhắc lịch trước sự kiện"
            checked={settings.emailEventReminder}
            onCheckedChange={(checked) =>
              update('emailEventReminder', checked)
            }
          />
          <SettingsField
            label="Thời gian gửi nhắc lịch (giờ trước sự kiện)"
            htmlFor="reminder-hours"
          >
            <Input
              id="reminder-hours"
              type="number"
              min={1}
              value={settings.reminderHoursBefore}
              onChange={(event) =>
                update('reminderHoursBefore', Number(event.target.value))
              }
              className="h-9"
            />
          </SettingsField>
        </SettingsSectionCard>

        <SettingsSectionCard title="Giao diện" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <SettingsField label="Chế độ giao diện" htmlFor="theme">
              <Select
                value={settings.theme}
                onValueChange={(value) => update('theme', value ?? 'system')}
              >
                <SelectTrigger id="theme" className="h-9 w-full">
                  <SelectValue placeholder="Chọn chế độ" />
                </SelectTrigger>
                <SelectContent>
                  {SETTINGS_THEME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>
            <SettingsField label="Ngôn ngữ mặc định" htmlFor="language">
              <Select
                value={settings.defaultLanguage}
                onValueChange={(value) =>
                  update('defaultLanguage', value ?? 'vi')
                }
              >
                <SelectTrigger id="language" className="h-9 w-full">
                  <SelectValue placeholder="Chọn ngôn ngữ" />
                </SelectTrigger>
                <SelectContent>
                  {SETTINGS_LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsField>
          </div>
        </SettingsSectionCard>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          className="h-9 cursor-pointer"
          onClick={handleReset}
        >
          Khôi phục mặc định
        </Button>
        <Button
          type="button"
          className="h-9 cursor-pointer"
          onClick={handleSave}
        >
          Lưu cấu hình
        </Button>
      </div>
    </div>
  );
}

export default Settings;
