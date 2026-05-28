import { images } from '@/assets';
import { Search } from 'lucide-react';

function SearchHero({ keyword }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <img
        src={images.home}
        alt="Search hero"
        className="h-[500px] w-full object-cover"
      />

      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-(--primary-color)/25 blur-3xl" />
      <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="container absolute inset-0 flex items-center">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-md">
            <Search size={16} />
            Kết quả tìm kiếm
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-(--primary-color)">
            Search results for
          </p>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            &quot;{keyword || 'Tất cả sự kiện'}&quot;
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Khám phá những sự kiện, nghệ sĩ và trải nghiệm phù hợp với nội dung
            bạn đang tìm kiếm.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SearchHero;
