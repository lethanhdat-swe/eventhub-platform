export default function OrganizerAvatar({ width = 100 ,height=72 }) {
  const heights = [8, 14, 20, 28, 20, 14, 8];

  return (
    <div 
      className="relative flex items-center justify-center rounded-full animate-pulse border-2 border-(--primary-color)/50"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="absolute inset-0 scale-110 rounded-full bg-(--primary-color)/15" />

      <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-600 to-purple-900" />

      <div className="relative flex items-center gap-0.75 h-8">
        {heights.map((h, i) => (
          <div
            key={i}
            className="w-0.75 rounded-sm bg-white/90 animate-[bounce_0.5s_ease-in-out_infinite_alternate]"
            style={{
              height: h,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}