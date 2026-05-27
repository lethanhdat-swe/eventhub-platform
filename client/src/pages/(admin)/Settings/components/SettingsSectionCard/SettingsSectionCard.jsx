import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

function SettingsSectionCard({ title, description, children, className }) {
  return (
    <Card className={cn('gap-0 py-0', className)}>
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 px-4 py-4">{children}</CardContent>
    </Card>
  );
}

export default SettingsSectionCard;
