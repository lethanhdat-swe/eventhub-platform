function BlogTitle({ blog }) {
  return (
    <div className="max-w-6xl mt-10">
      <div className="mb-5 inline-flex items-center rounded-full border border-(--primary-color)/25 bg-(--primary-color)/10 px-4 py-2">
        <span className="text-xs font-black uppercase tracking-[0.24em] text-(--primary-color)">
          {blog.category || 'Bài viết'}
        </span>
      </div>

      <h1
        className="
          max-w-6xl text-[42px] font-black leading-[1.08]
          tracking-[-0.045em] text-(--text-primary)
          md:text-[56px]
        "
      >
        {blog.title}
      </h1>
    </div>
  );
}

export default BlogTitle;
