import { authService } from '@/lib/services/auth';
import { uploadService } from '@/lib/services/upload/uploadService';
import { useAuthStore } from '@/stores/authStore';
import { Camera } from 'lucide-react';
import { useRef } from 'react';

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
      setUser(updatedUser);
    } catch (err) {
      console.error("Upload avatar thất bại:", err);
    }
  };

  console.log("Current user:", user);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="relative p-3 cursor-pointer w-35 h-35 group"
    >
      <img
        src={`${import.meta.env.VITE_API_URL}${user.avatarUrl}`}
        alt="avatar"
        className="object-cover w-full h-full border border-(--primary-color)"
        style={{ borderRadius: 'calc(1.25rem - 3px)' }}
      />
      <Camera color='var(--text-primary)' className='absolute transition-opacity duration-200 -translate-x-1/2 opacity-0 bottom-4 left-1/2 group-hover:opacity-100' />
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}