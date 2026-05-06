import BlogFilter from "./components/BlogFilter/BlogFilter";
import BlogHero from "./components/BlogHero/BlogHero";

function Blog() {
    return ( 
        <div className="pt-(--header-height)">
            <BlogHero />
            <BlogFilter />
        </div>
     );
}

export default Blog;