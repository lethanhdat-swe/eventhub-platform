import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  EVENT_STATUS_OPTIONS,
  MOCK_CATEGORIES,
} from '@/pages/(admin)/Events/data';

const INITIAL_FORM = {
  title: '',
  slug: '',
  description: '',
  contentHtml: '',
  location: '',
  startDate: '',
  endDate: '',
  thumbnailUrl: '',
  status: 'draft',
  categoryId: '',
};

function FormField({ label, htmlFor, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const updateSelect = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value ?? '' }));
  };

  const logPayload = (payload) => {
    // Placeholder — chưa gọi API
    console.log('[CreateEvent]', payload);
  };

  const handleCancel = () => {
    navigate('/admin/events');
  };

  const handleSaveDraft = () => {
    logPayload({ ...form, status: 'draft' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    logPayload({ ...form, status: form.status || 'active' });
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Tạo sự kiện"
        description="Thêm sự kiện mới và cấu hình thông tin hiển thị cho người dùng."
      />

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Card size="sm">
          <CardHeader className="border-b pb-3">
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FormField label="Tên sự kiện" htmlFor="title">
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={updateField('title')}
                  placeholder="Nhập tên sự kiện"
                  className="h-9"
                />
              </FormField>
              <FormField label="Slug" htmlFor="slug">
                <Input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={updateField('slug')}
                  placeholder="ten-su-kien"
                  className="h-9"
                />
              </FormField>
            </div>

            <FormField label="Danh mục" htmlFor="categoryId">
              <Select
                value={form.categoryId || null}
                onValueChange={updateSelect('categoryId')}
              >
                <SelectTrigger
                  id="categoryId"
                  className="h-9 w-full"
                  size="default"
                >
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Mô tả ngắn" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={updateField('description')}
                placeholder="Mô tả ngắn hiển thị trên danh sách sự kiện"
                rows={3}
                className="min-h-[72px] resize-y"
              />
            </FormField>

            <FormField label="Nội dung chi tiết" htmlFor="contentHtml">
              <Textarea
                id="contentHtml"
                name="contentHtml"
                value={form.contentHtml}
                onChange={updateField('contentHtml')}
                placeholder="Nội dung HTML chi tiết (ví dụ: &lt;p&gt;...&lt;/p&gt;)"
                rows={6}
                className="min-h-[120px] resize-y"
              />
            </FormField>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="border-b pb-3">
            <CardTitle>Thời gian & địa điểm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            <FormField label="Địa điểm" htmlFor="location">
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={updateField('location')}
                placeholder="Nhà thi đấu, địa chỉ..."
                className="h-9"
              />
            </FormField>

            <div className="grid gap-3 md:grid-cols-2">
              <FormField label="Ngày bắt đầu" htmlFor="startDate">
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={updateField('startDate')}
                  className="h-9"
                />
              </FormField>
              <FormField label="Ngày kết thúc" htmlFor="endDate">
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={updateField('endDate')}
                  className="h-9"
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="border-b pb-3">
            <CardTitle>Hình ảnh & trạng thái</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            <FormField label="Ảnh thumbnail (URL)" htmlFor="thumbnailUrl">
              <Input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                value={form.thumbnailUrl}
                onChange={updateField('thumbnailUrl')}
                placeholder="https://..."
                className="h-9"
              />
            </FormField>

            <FormField label="Trạng thái" htmlFor="status">
              <Select value={form.status} onValueChange={updateSelect('status')}>
                <SelectTrigger id="status" className="h-9 w-full md:max-w-xs">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-9"
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9"
            onClick={handleSaveDraft}
          >
            Lưu bản nháp
          </Button>
          <Button type="submit" className="h-9">
            Tạo sự kiện
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
