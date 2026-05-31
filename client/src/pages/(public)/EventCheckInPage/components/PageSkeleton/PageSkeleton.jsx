function PageSkeleton() {
  return (
    <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-5">
        <div className="h-72 animate-pulse rounded-3xl bg-(--text-primary)/5" />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
          <div className="h-96 animate-pulse rounded-3xl bg-(--text-primary)/5" />
          <div className="h-96 animate-pulse rounded-3xl bg-(--text-primary)/5" />
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;
