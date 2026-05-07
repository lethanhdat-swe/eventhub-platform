import {useParams } from "react-router-dom";
import { blogs } from "../data";
import BackButton from "./components/BackButton/BackButton";
import BlogMeta from "./components/BlogMeta/BlogMeta";
import BlogTitle from "./components/BlogTitle/BlogTitle";
import BlogContent from "./components/BlogContent/BlogContent";
import FeedbackActions from "./components/FeedbackActions/FeedbackActions";
import BlogRelated from "./components/BlogRelated/BlogRelated";

function BlogDetail() {
    const { id } = useParams();
    const blog = blogs.find((e) => e.id === Number(id));

    if (!blog) return <div>blog not found</div>;

    const relatedBlogs = blogs.filter((e) => e.id !== Number(id));
    return (
        <div className="pt-(--header-height) p-10">
           <BackButton />
           <BlogTitle blog={blog}/>
           <BlogMeta blog={blog}/>
           <BlogContent blog={blog} />
           <FeedbackActions />
            <BlogRelated relatedBlogs={relatedBlogs}/>
        </div>
      );
}

export default BlogDetail;