import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbnailUploadField } from '@/components/form';
import { bannerService } from '@/lib/services/banner';
import { toast } from 'sonner';

function BannerUploadsField({ max = 10, label = 'Banner website' }) {
  const [banners, setBanners] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const originalBannersRef = useRef([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannerService.getAllBanners();
        const data = response || [];
        setBanners(data);
        originalBannersRef.current = data;
      } catch (error) {
        console.error(error);
      }
    };

    fetchBanners();
  }, []);

  const handleAdd = () => {
    if (banners.length >= max) return;
    setBanners([...banners, { id: undefined, imageUrl: '' }]);
  };

  const handleUpdate = (index, newImageUrl) => {
    const next = [...banners];
    next[index] = { ...next[index], imageUrl: newImageUrl };
    setBanners(next);
  };

  const handleRemove = async (index) => {
    const banner = banners[index];

    if (!banner.id) {
      setBanners(banners.filter((_, i) => i !== index));
      return;
    }

    try {
      await bannerService.deleteBanner(banner.id);
    } catch (error) {
      if (!error.message?.toLowerCase().includes('success')) {
        toast.error(error?.message || 'Xóa banner thất bại');
        console.error('DELETE error:', error);
        return;
      }
    }

    toast.success('Đã xóa banner');
    setBanners((prev) => prev.filter((_, i) => i !== index));
    originalBannersRef.current = originalBannersRef.current.filter(
      (b) => b.id !== banner.id
    );
  };

  const handleSave = async () => {
    const original = originalBannersRef.current;

    const newBanners = banners.filter((b) => !b.id && b.imageUrl);
    const updatedBanners = banners.filter((b) => {
      if (!b.id) return false;
      const orig = original.find((o) => o.id === b.id);
      return orig && orig.imageUrl !== b.imageUrl;
    });

    try {
      setIsSaving(true);

      if (newBanners.length > 0) {
        await bannerService.createBanners({
          imageUrls: newBanners.map((b) => b.imageUrl),
        });
      }

      await Promise.all(
        updatedBanners.map((b) =>
          bannerService.updateBanner(b.id, { imageUrl: b.imageUrl })
        )
      );

      if (newBanners.length > 0) {
        const refreshed = await bannerService.getAllBanners();
        const data = refreshed || [];
        setBanners(data);
        originalBannersRef.current = data;
      } else {
        originalBannersRef.current = [...banners];
      }

      toast.success('Lưu banner thành công');
    } catch (error) {
      toast.error(error?.message || 'Lưu banner thất bại');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{label}</h3>
          <p className="text-xs text-muted-foreground">
            Upload nhiều banner cho homepage
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={handleAdd}
          disabled={banners.length >= max}
        >
          Thêm banner
        </Button>
      </div>

      <div className="space-y-5">
        {banners.map((banner, index) => (
          <div key={banner.id ?? `new-${index}`} className="p-4 space-y-3 border rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Banner #{index + 1}</p>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                onClick={() => handleRemove(index)}
              >
                Xóa
              </Button>
            </div>

            <ThumbnailUploadField
              value={banner.imageUrl}
              onChange={(newValue) => handleUpdate(index, newValue)}
              label={`Ảnh banner ${index + 1}`}
            />
          </div>
        ))}

        {banners.length === 0 && (
          <div className="p-8 text-sm text-center border border-dashed rounded-xl text-muted-foreground">
            Chưa có banner nào
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          size="sm"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Đang lưu...' : 'Lưu banner'}
        </Button>
      </div>
    </div>
  );
}

export default BannerUploadsField;