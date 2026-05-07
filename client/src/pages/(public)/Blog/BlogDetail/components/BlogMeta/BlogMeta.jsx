import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/assets/icons";
import { Calendar, Clock4, Eye, Link } from "lucide-react";

function BlogMeta({blog}) {
    const shareIcons = [FacebookIcon, InstagramIcon, TwitterIcon, Link];

    return ( 
        <div className="flex items-center justify-between">
                <div className="flex mt-7 gap-15">
                    <div className="flex items-center gap-2">
                        <Calendar color="var(--text-primary)"/>
                        <p className="text-(--text-primary)/70">{blog.date}</p> 
                    </div>

                <div className="flex items-center gap-2">
                    <Eye color="var(--text-primary)"/>
                    <p className="text-(--text-primary)/70">{blog.views} views</p> 
                </div>

                <div className="flex items-center gap-2">
                    <Clock4 color="var(--text-primary)"/>
                    <p className="text-(--text-primary)/70">{blog.readTime} views</p> 
                </div>
            </div>

             <div className="flex items-center gap-4 text-(--text-primary)">
            <p>Share: </p>
            {shareIcons.map((Icon, i) => (
                <div key={i} className="p-2 border-2 rounded-3xl border-white/20
                                        transition-all duration-300
                                        hover:border-(--primary-color)
                                        hover:bg-(--primary-color)/10
                                        hover:scale-110
                                        active:scale-95
                                        cursor-pointer">
                <Icon />
                </div>
            ))}
            </div>
        </div>
     );
}

export default BlogMeta;