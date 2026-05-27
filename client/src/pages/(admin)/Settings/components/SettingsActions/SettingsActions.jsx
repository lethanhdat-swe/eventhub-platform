import { Button } from '@/components/ui/button';

function SettingsActions({ onSave, onReset }) {
  return (
    <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-border">
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer h-9"
        onClick={onReset}
      >
        Khôi phục mặc định
      </Button>

      <Button
        type="button"
        className="cursor-pointer h-9"
        onClick={onSave}
      >
        Lưu cấu hình
      </Button>
    </div>
  );
}

export default SettingsActions;