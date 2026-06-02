import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { categoryService } from '@/lib/services/admin/categoryService';
import { eventService } from '@/lib/services/admin/eventService';
import { artistService } from '@/lib/services/admin/artistService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import EventForm from '@/pages/(admin)/Events/components/EventForm/EventForm';
import {
  buildEventPayload,
  mapEventRow,
  mapEventToFormValues,
} from '@/pages/(admin)/Events/data';
import { toast } from 'sonner';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const payload = await categoryService.list({ page: 1, limit: 100 });
      setCategories(payload.data ?? []);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadArtists = useCallback(async () => {
    try {
      const payload = await artistService.list({ page: 1, limit: 100 });
      setArtists(payload.data ?? []);
    } catch {
      setArtists([]);
    }
  }, []);

  const loadEvent = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventService.getById(id);
      const row = mapEventRow(data);
      setFormValues(mapEventToFormValues(row));
    } catch (e) {
      setError(getErrorMessage(e));
      setFormValues(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadCategories();
    void loadArtists();
    void loadEvent();
  }, [loadCategories, loadArtists, loadEvent]);

  const handleSubmit = async (form) => {
      if (!id) return;

      setSubmitting(true);
      setFormError("");

      const toastId = toast.loading("Đang cập nhật sự kiện...");

      try {
        await eventService.update(id, buildEventPayload(form));

        toast.success("Cập nhật sự kiện thành công", {
          id: toastId,
        });

        navigate(`/admin/events/${id}`);
      } catch (e) {
        const message = getErrorMessage(e);

        setFormError(message);

        toast.error(message || "Cập nhật sự kiện thất bại", {
          id: toastId,
        });
      } finally {
        setSubmitting(false);
      }
    };

  if (isLoading) {
    return (
      <p className="py-8 text-sm text-muted-foreground">Đang tải sự kiện…</p>
    );
  }

  if (error || !formValues) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-1.5 px-2"
          onClick={() => navigate('/admin/events')}
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Button>
        <p className="text-sm text-destructive" role="alert">
          {error ?? 'Không tìm thấy sự kiện.'}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void loadEvent()}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="mt-0.5 shrink-0"
          aria-label="Quay lại"
          onClick={() => navigate(`/admin/events/${id}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <PageHeader
          title="Chỉnh sửa sự kiện"
          description="Cập nhật thông tin hiển thị và trạng thái sự kiện."
          className="flex-1"
        />
      </div>

      <EventForm
        key={id}
        initialValues={formValues}
        categories={categories}
        artists={artists}
        submitting={submitting}
        formError={formError}
        isCreate={false}
        submitLabel="Lưu thay đổi"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/events/${id}`)}
      />
    </div>
  );
}

export default EditEvent;
