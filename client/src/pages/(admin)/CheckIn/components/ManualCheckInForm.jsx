import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ManualCheckInForm = forwardRef(function ManualCheckInForm(
  { code, onCodeChange, onSubmit, isSubmitting },
  ref
) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Nhập mã thủ công</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <Label htmlFor="checkin-code" className="sr-only">
              Mã vé hoặc QR
            </Label>
            <Input
              ref={ref}
              id="checkin-code"
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              placeholder="Nhập mã QR hoặc mã vé..."
              className="h-9"
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            className="h-9 shrink-0 cursor-pointer sm:min-w-24"
            disabled={isSubmitting || !code.trim()}
          >
            Kiểm tra
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});

export default ManualCheckInForm;
