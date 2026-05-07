function BlogTitle({blog}) {
    return ( 
         <div className="flex flex-col justify-center col-span-7 gap-3 mt-7">
          <p className="text-(--primary-color) font-semibold mb-4 text-xl">{blog.category}</p>

          <h1 className="text-(--text-primary) text-5xl font-bold">{blog.title}</h1>
        </div>
     );
}

export default BlogTitle;