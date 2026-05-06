import { images } from '@/assets';

function HappyCustomers() {
  const AVATAR_COLORS = [
    images.avatar1,
    images.avatar2,
    images.avatar3,
    images.avatar4,
    images.avatar5,
  ];
  return (
    <div className="px-5 py-4 border bg-black/60 backdrop-blur-md border-white/10 rounded-2xl">
      <div className="flex items-center gap-1 mb-2">
        {AVATAR_COLORS.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${img}`}
            className="w-8 h-8 border-2 rounded-full border-black/80"
          />
        ))}
      </div>
      <p
        className="text-2xl font-black text-white"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        50K+
      </p>
      <p className="text-xs text-gray-400">Happy Customers</p>
    </div>
  );
}

export default HappyCustomers;
