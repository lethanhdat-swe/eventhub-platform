import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


import {
  SETTINGS_THEME_OPTIONS,
  SETTINGS_LANGUAGE_OPTIONS,
} from '../../data';
import SettingsSectionCard from '../SettingsSectionCard/SettingsSectionCard';
import SettingsField from '../SettingsField/SettingsField';

function AppearanceSettingsSection({ settings, update }) {
  return (
    <SettingsSectionCard
      title="Giao diện"
      className="lg:col-span-2"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SettingsField label="Chế độ giao diện" htmlFor="theme">
          <Select
            value={settings.theme}
            onValueChange={(value) => update('theme', value)}
          >
            <SelectTrigger id="theme" className="w-full h-9">
              <SelectValue placeholder="Chọn chế độ" />
            </SelectTrigger>

            <SelectContent>
              {SETTINGS_THEME_OPTIONS.map((option) => (
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

        <SettingsField
          label="Ngôn ngữ mặc định"
          htmlFor="language"
        >
          <Select
            value={settings.defaultLanguage}
            onValueChange={(value) =>
              update('defaultLanguage', value)
            }
          >
            <SelectTrigger id="language" className="w-full h-9">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>

            <SelectContent>
              {SETTINGS_LANGUAGE_OPTIONS.map((option) => (
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
      </div>
    </SettingsSectionCard>
  );
}

export default AppearanceSettingsSection;