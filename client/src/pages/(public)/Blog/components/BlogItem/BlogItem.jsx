import { ArrowRight, Calendar, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BlogItem({blog}) {
    const navigate = useNavigate();

    return ( 
        <div onClick={() => navigate(`/blog/${blog.id}`)} className="container mt-5">
            <div className="grid grid-cols-12 gap-5 p-5 border-2 border-white/10 rounded-3xl transition-all duration-500 ease-in-out
                      hover:border-(--primary-color) 
                      group cursor-pointer">
                <div className="col-span-5 overflow-hidden rounded-3xl">
                    <img src={blog.image} alt={blog.title} className="object-cover w-full transition-transform duration-500 ease-in-out h-65 rounded-3xl group-hover:scale-105"/>
                </div>

                <div className="flex flex-col justify-center col-span-7 gap-3 ">
                    <p className="text-(--primary-color) font-semibold mb-4">{blog.category}</p>

                    <h1 className="text-(--text-primary) text-3xl font-bold">{blog.title}</h1>

                    <p className="text-(--text-primary)/70">{blog.excerpt}</p>

                    <div className="flex justify-between w-full mt-4">
                        <div className="flex gap-15">
                            <div className="flex items-center gap-2">
                            <Calendar color="var(--text-primary)"/>
                            <p className="text-(--text-primary)/70">{blog.date}</p> 
                        </div>

                         <div className="flex items-center gap-2">
                            <Eye color="var(--text-primary)"/>
                            <p className="text-(--text-primary)/70">{blog.views} views</p> 
                        </div>
                        </div>

                        <button onClick={() => navigate(`/blog/${blog.id}`)} className="p-2 border-2 border-white/10 rounded-3xl
                               transition-all duration-300 ease-in-out
                               hover:border-(--primary-color)
                               hover:bg-(--primary-color)
                               hover:scale-110 cursor-pointer"><ArrowRight color="var(--text-primary)"/> </button>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default BlogItem;