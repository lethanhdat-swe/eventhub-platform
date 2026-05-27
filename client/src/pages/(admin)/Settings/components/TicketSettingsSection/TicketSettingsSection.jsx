import { Input } from '@/components/ui/input';
import SettingsSectionCard from '../SettingsSectionCard/SettingsSectionCard';
import SettingsCheckboxField from '../SettingsCheckboxField/SettingsCheckboxField';
import SettingsField from '../SettingsField/SettingsField';

function TicketSettingsSection({ settings, update }) {
  return (
    <SettingsSectionCard title="Vé & QR">
      <SettingsCheckboxField
        id="allow-duplicate-checkin"
        label="Cho phép check-in trùng"
        checked={settings.allowDuplicateCheckIn}
        onCheckedChange={(checked) =>
          update('allowDuplicateCheckIn', checked)
        }
      />

      <SettingsField
        label="Thời gian hiệu lực QR (giờ)"
        htmlFor="qr-validity"
      >
        <Input
          id="qr-validity"
          type="number"
          min={1}
          value={settings.qrValidityHours}
          onChange={(e) =>
            update('qrValidityHours', Number(e.target.value))
          }
          className="h-9"
        />
      </SettingsField>

      <SettingsField
        label="Prefix mã vé"
        htmlFor="ticket-prefix"
      >
        <Input
          id="ticket-prefix"
          value={settings.ticketCodePrefix}
          onChange={(e) =>
            update('ticketCodePrefix', e.target.value)
          }
          className="uppercase h-9"
        />
      </SettingsField>
    </SettingsSectionCard>
  );
}

export default TicketSettingsSection;