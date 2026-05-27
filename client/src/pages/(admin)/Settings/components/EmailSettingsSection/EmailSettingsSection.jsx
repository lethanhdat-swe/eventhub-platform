import { Input } from '@/components/ui/input';
import SettingsCheckboxField from '../SettingsCheckboxField/SettingsCheckboxField';
import SettingsSectionCard from '../SettingsSectionCard/SettingsSectionCard';
import SettingsField from '../SettingsField/SettingsField';

function EmailSettingsSection({ settings, update }) {
  return (
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
          onChange={(e) =>
            update('reminderHoursBefore', Number(e.target.value))
          }
          className="h-9"
        />
      </SettingsField>
    </SettingsSectionCard>
  );
}

export default EmailSettingsSection;