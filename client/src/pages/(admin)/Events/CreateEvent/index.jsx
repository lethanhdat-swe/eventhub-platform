import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getErrorMessage } from '@/lib/http/apiError';
import { categoryService } from '@/lib/services/admin/categoryService';
import { eventService } from '@/lib/services/admin/eventService';
import { artistService } from '@/lib/services/admin/artistService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import EventForm from '@/pages/(admin)/Events/components/EventForm';
import { buildEventPayload } from '@/pages/(admin)/Events/data';
import { toast } from 'sonner';

function CreateEvent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

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

  useEffect(() => {
    void loadCategories();
    void loadArtists();
  }, [loadCategories, loadArtists]);

  const saveEvent = async (form, statusOverride) => {
    setSubmitting(true);
    setFormError("");

    try {
      const payload = buildEventPayload({
        ...form,
        status: statusOverride ?? form.status,
      });

      const created = await eventService.create(payload);

      toast.success("Tạo sự kiện thành công");

      navigate(
        created?.id
          ? `/admin/events/${created.id}`
          : "/admin/events"
      );
    } catch (e) {
      const message = getErrorMessage(e);

      setFormError(message);

      toast.error(message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Tạo sự kiện"
        description="Thêm sự kiện mới và cấu hình thông tin hiển thị cho người dùng."
      />

      <EventForm
        categories={categories}
        artists={artists}
        submitting={submitting}
        formError={formError}
        isCreate
        submitLabel="Tạo sự kiện"
        showDraftButton
        onSubmit={(form) => void saveEvent(form)}
        onSaveDraft={(form) => void saveEvent(form, 'DRAFT')}
        onCancel={() => navigate('/admin/events')}
      />
    </div>
  );
}

export default CreateEvent;
