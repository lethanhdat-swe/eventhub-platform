import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SETTINGS_PAYMENT_OPTIONS } from '../../data';
import SettingsSectionCard from '../SettingsSectionCard/SettingsSectionCard';
import SettingsField from '../SettingsField/SettingsField';
import SettingsCheckboxField from '../SettingsCheckboxField/SettingsCheckboxField';

function PaymentSettingsSection({ settings, update }) {
  return (
    <SettingsSectionCard title="Thanh toán">
      <SettingsField
        label="Phương thức thanh toán mặc định"
        htmlFor="payment-method"
      >
        <Select
          value={settings.defaultPaymentMethod}
          onValueChange={(value) =>
            update('defaultPaymentMethod', value)
          }
        >
          <SelectTrigger id="payment-method" className="w-full h-9">
            <SelectValue placeholder="Chọn phương thức" />
          </SelectTrigger>

          <SelectContent>
            {SETTINGS_PAYMENT_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
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
        onCheckedChange={(checked) =>
          update('autoConfirmPayment', checked)
        }
      />

      <SettingsField
        label="Thời gian giữ ghế (phút)"
        htmlFor="seat-hold"
      >
        <Input
          id="seat-hold"
          type="number"
          min={1}
          value={settings.seatHoldMinutes}
          onChange={(e) =>
            update('seatHoldMinutes', Number(e.target.value))
          }
          className="h-9"
        />
      </SettingsField>
    </SettingsSectionCard>
  );
}

export default PaymentSettingsSection;