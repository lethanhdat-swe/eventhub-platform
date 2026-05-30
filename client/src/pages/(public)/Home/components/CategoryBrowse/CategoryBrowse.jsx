import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categoryService } from '@/lib/services/admin';

function CategoryBrowse() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      try {
        setLoading(true);

        const res = await categoryService.list({
          page: 1,
          limit: 4,
        });

        if (ignore) return;

        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setCategories(list);
      } catch (error) {
        console.error('Fetch categories failed:', error);

        if (!ignore) {
          setCategories([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="container mt-16">
      <div className="mb-7 flex items-start justify-between gap-4 md:gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
            <Sparkles size={23} />
          </div>

          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.24em] text-(--primary-color)">
              Danh mục sự kiện
            </p>

            <h2 className="text-2xl font-black tracking-tight text-(--text-primary) md:text-3xl">
              Khám phá theo sở thích của bạn
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-(--text-primary)/55">
              Chọn nhanh nhóm sự kiện bạn quan tâm và bắt đầu khám phá những
              trải nghiệm phù hợp.
            </p>
          </div>
        </div>

        <button className="group hidden shrink-0 items-center gap-2 rounded-full border border-(--text-primary)/10 bg-(--surface-color) px-5 py-2.5 text-sm font-bold whitespace-nowrap text-(--text-primary)/80 shadow-sm transition hover:border-(--primary-color)/40 hover:text-(--primary-color) sm:flex md:px-6 md:py-3">
          Xem tất cả
          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  return (
    <button className="group relative overflow-hidden rounded-[22px] border border-(--text-primary)/10 bg-(--surface-color) p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-(--primary-color)/45 hover:shadow-[0_18px_55px_rgba(124,58,237,0.16)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_0%,transparent_42%,rgba(124,58,237,0.18)_100%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-(--primary-color)/12 blur-3xl transition group-hover:bg-(--primary-color)/25" />

      <div className="relative z-10 flex min-h-[128px] flex-col">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--text-primary)/10 bg-(--background-color) text-(--primary-color) transition group-hover:scale-105">
            <Sparkles size={21} />
          </div>

          <span className="rounded-full border border-(--text-primary)/10 bg-(--background-color)/80 px-3 py-1 text-xs font-bold text-(--text-primary)/55">
            {category.eventCount ?? 0} sự kiện
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="line-clamp-1 text-xl font-black text-(--text-primary)">
            {category.name}
          </h3>

          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-(--primary-color)">
            Khám phá
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-(--text-primary)/10 bg-(--surface-color) p-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_42%,rgba(124,58,237,0.12)_100%)]" />

      <div className="relative z-10 flex min-h-[128px] flex-col">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-(--background-color)" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-(--background-color)" />
        </div>

        <div className="mt-auto">
          <div className="h-6 w-28 animate-pulse rounded-lg bg-(--background-color)" />
          <div className="mt-4 h-5 w-20 animate-pulse rounded-lg bg-(--background-color)" />
        </div>
      </div>
    </div>
  );
}

export default CategoryBrowse;
