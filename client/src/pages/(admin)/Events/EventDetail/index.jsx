import { ArrowLeft, Pencil } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getErrorMessage } from '@/lib/http/apiError';
import { eventService } from '@/lib/services/admin/eventService';
import StatusBadge from '@/pages/(admin)/components/StatusBadge';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import {
  ARTIST_ROLE_LABELS,
  formatCreatedAt,
  formatDateTime,
  mapEventRow,
} from '@/pages/(admin)/Events/data';

function DetailRow({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm">{children ?? '—'}</div>
    </div>
  );
}

function AdminEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvent = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventService.getById(id);
      setEvent(mapEventRow(data));
    } catch (e) {
      setError(getErrorMessage(e));
      setEvent(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  if (isLoading) {
    return (
      <p className="py-8 text-sm text-muted-foreground">Đang tải chi tiết sự kiện…</p>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-1.5 px-2"
          onClick={() => navigate('/admin/events')}
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Button>
        <div
          className="px-3 py-4 text-sm border rounded-lg border-destructive/25 bg-destructive/5 text-destructive"
          role="alert"
        >
          {error ?? 'Không tìm thấy sự kiện.'}
        </div>
        <Button type="button" variant="outline" onClick={() => void loadEvent()}>
          Thử lại
        </Button>
      </div>
    );
  }

  const thumbnailSrc = event.thumbnailUrl
    ? resolvePublicAssetUrl(event.thumbnailUrl, '')
    : '';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start min-w-0 gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mt-0.5 shrink-0"
            aria-label="Quay lại"
            onClick={() => navigate('/admin/events')}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight">{event.title}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">/{event.slug}</p>
          </div>
        </div>
        <Button
          type="button"
          className="h-9 shrink-0 gap-1.5"
          onClick={() => navigate(`/admin/events/${event.id}/edit`)}
        >
          <Pencil className="size-4" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[240px_1fr]">
        <Card size="sm" className="h-fit">
          <CardContent className="pt-4">
            {thumbnailSrc ? (
              <img
                src={thumbnailSrc}
                alt=""
                className="object-cover w-32 rounded-md sm:w-40 lg:w-full aspect-square"
              />
            ) : (
              <div className="flex items-center justify-center w-full text-3xl font-semibold rounded-md aspect-square bg-muted text-muted-foreground">
                {event.title?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3 w-100 lg:w-full">
          <Card size="sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-3 sm:grid-cols-2">
              <DetailRow label="Trạng thái">
                <StatusBadge status={event.status} />
              </DetailRow>
              <DetailRow label="Danh mục">
                {event.category?.name ?? '—'}
              </DetailRow>
              <DetailRow label="Địa điểm">{event.location || '—'}</DetailRow>
              <DetailRow label="Ngày bắt đầu">
                {formatDateTime(event.startDate)}
              </DetailRow>
              <DetailRow label="Ngày kết thúc">
                {formatDateTime(event.endDate)}
              </DetailRow>
              <DetailRow label="Ngày tạo">
                {formatCreatedAt(event.createdAt)}
              </DetailRow>
              <DetailRow label="Cập nhật lần cuối">
                {formatCreatedAt(event.updatedAt)}
              </DetailRow>
            </CardContent>
          </Card>

          {event.description ? (
            <Card size="sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle>Mô tả ngắn</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ) : null}

          {event.contentHtml ? (
            <Card size="sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle>Nội dung chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div
                  className="prose-sm prose max-w-none text-foreground dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: event.contentHtml }}
                />
              </CardContent>
            </Card>
          ) : null}

          {event.eventArtists?.length > 0 ? (
            <Card size="sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle>Nghệ sĩ tham gia</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <ul className="divide-y divide-border">
                  {event.eventArtists.map((item) => (
                    <li
                      key={item.artist?.id ?? item.artistId}
                      className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm font-medium">
                        {item.artist?.name ?? '—'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {ARTIST_ROLE_LABELS[item.role] ?? item.role ?? '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AdminEventDetail;
