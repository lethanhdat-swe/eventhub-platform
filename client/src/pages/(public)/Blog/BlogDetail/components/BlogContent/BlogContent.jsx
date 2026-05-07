import { Dot } from "lucide-react";

function BlogContent({blog}) {
    return ( 
        <div className="mt-5">
          <div className="w-full h-137.5 overflow-hidden rounded-2xl">
            <img
                src={blog.image}
                alt={blog.title}
                className="object-cover w-full h-full"
            />
            </div>

           <div className="p-10">
             <p className="text-(--text-primary)/60 text-xl">{blog.content.intro}</p>

             <div className="mt-10">
                {blog.content.sections.map((section, id) => (
                    <div key={id} className="mb-10">
                        <h1 className="text-(--text-primary) text-2xl font-semibold mb-2">{section.heading}</h1>
                        <p className="text-(--text-primary)/60 text-xl mb-2">{section.body}</p>

                        <ul>
                            {section.bullets.map((bullet, id) => (
                                <li key={id} className="flex items-center gap-3">
                                    <Dot size={50} color="var(--primary-color)"/> 
                                    <p className="text-(--text-primary) text-xl">{bullet.label}</p>
                                    
                                     <p className="text-(--text-primary)/60 text-xl">- {bullet.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
             </div>
           </div>
        </div>
     );
}

export default BlogContent;