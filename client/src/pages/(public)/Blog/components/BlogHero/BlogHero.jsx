import { images } from "@/assets";

function BlogHero() {
    return ( 
        <div className="relative">
             <img src={images.Pornhub} alt="" className="object-cover w-full h-70" />
             <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />
             <div className="container absolute flex items-center justify-between top-10 left-10 right-10">
               <div className="flex flex-col gap-5">
                 <p className="uppercase text-(--primary-color)">blog & news</p>
                <h1 className="text-5xl font-bold text-white">
                    EventHub <span className="bg-linear-to-r from-[#D336BE] to-[#9152FF] bg-clip-text text-transparent">
                        Insights
                    </span>
                    </h1>
                    <p className="text-sm leading-relaxed text-white max-w-120">
                    Your hub for the latest updates, event reviews, guides and everything live experience.
                    </p>
               </div>
             </div>
           </div>
     );
}

export default BlogHero;