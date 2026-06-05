import { authService } from '@/lib/services/auth';
import { uploadService } from '@/lib/services/upload/uploadService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';
import { useAuthStore } from '@/stores/authStore';
import { Camera } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export function AvatarUpload() {
    const { user, setUser } = useAuthStore();
    const inputRef = useRef(null);

    const handleChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploadRes = await uploadService.uploadImage(file);
            const url = uploadRes.url;

            const updateRes = await authService.updateMe({
                fullName: user?.fullName,
                phoneNumber: user?.phoneNumber,
                avatarUrl: url,
            });

            const updatedUser = updateRes.data;
            setUser({ ...user, avatarUrl: url });
            toast.success('Cập nhật avatar thành công');
        } catch (err) {
            console.error('Upload avatar thất bại:', err);
            toast.error(
                err?.response?.data?.message || 'Cập nhật avatar thất bại'
            );
        }
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            className="relative w-24 h-24 p-2 cursor-pointer shrink-0 sm:p-3 sm:w-35 sm:h-35 group"
        >
            <img
                src={resolvePublicAssetUrl(user.avatarUrl)}
                alt="avatar"
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full border border-(--primary-color)"
                style={{ borderRadius: 'calc(1.25rem - 3px)' }}
            />
            <Camera
                color="var(--text-primary)"
                className="absolute transition-opacity duration-200 -translate-x-1/2 opacity-0 bottom-4 left-1/2 group-hover:opacity-100"
            />
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
}
