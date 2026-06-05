export const SETTINGS_THEME_OPTIONS = [
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
  { value: 'system', label: 'Theo hệ thống' },
];

export const SETTINGS_LANGUAGE_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
];

export const SETTINGS_PAYMENT_OPTIONS = [
  { value: 'SEPAY', label: 'SEPAY' },
];

export const DEFAULT_SETTINGS = {
  siteName: 'EventHub',
  supportEmail: 'support@eventhub.vn',
  hotline: '1900 6868',
  companyAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  defaultPaymentMethod: 'SEPAY',
  autoConfirmPayment: true,
  seatHoldMinutes: 15,
  allowDuplicateCheckIn: false,
  qrValidityHours: 24,
  ticketCodePrefix: 'V',
  emailTicketConfirmation: true,
  emailEventReminder: true,
  reminderHoursBefore: 24,
  theme: 'system',
  defaultLanguage: 'vi',
};

export function cloneDefaultSettings() {
  return { ...DEFAULT_SETTINGS };
}
