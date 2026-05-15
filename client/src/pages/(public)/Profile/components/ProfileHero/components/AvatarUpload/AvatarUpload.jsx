import { images } from '@/assets';
import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';

export function AvatarUpload() {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="relative p-3 cursor-pointer w-35 h-35 group"
    >
      <img
        src={preview ?? images.profile}
        alt="avatar"
        className="object-cover w-full h-full border border-(--primary-color)"
        style={{ borderRadius: 'calc(1.25rem - 3px)' }}
      />

      <Camera color='var(--text-primary)' className='absolute transition-opacity duration-200 -translate-x-1/2 opacity-0 bottom-4 left-1/2 group-hover:opacity-100' />

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}