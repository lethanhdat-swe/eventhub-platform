import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BlogItem from "../../../components/BlogItem/BlogItem";

function BlogRelated({relatedBlogs}) {
    const navigate = useNavigate();
    return ( 
         <div className="mt-10">
                <div className="flex justify-between">
                     <p className="text-(--text-primary) text-xl">Related Articles</p>
                     <Link to={'/blogs'} className="text-(--primary-color) text-xl flex items-center gap-2">View all blogs <ArrowRight /> </Link>
                </div>
           <div>
            <div className="grid grid-cols-2">
            {relatedBlogs.slice(0,2).map((blog, id) => (
               <BlogItem key={id} blog={blog}/>
            ))}
            </div>
           </div>
           </div>
     );
}

export default BlogRelated;