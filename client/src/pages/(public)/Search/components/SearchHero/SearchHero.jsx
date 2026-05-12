import { images } from "@/assets";

function SearchHero({keyword}) {
    return ( 
        <div className="relative">
            <img src={images.home} alt="" className="object-cover w-full h-70" />
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />
            <div className="container absolute flex items-center justify-between top-10 left-10 right-10">
                <div className="flex flex-col gap-5">
                    <p className="text-white">Search results for</p>
                    <h1 className="text-5xl font-bold text-white">
                    &quot;{keyword}&quot;
                    </h1>
                    <p className="text-sm leading-relaxed text-white max-w-120">
                        Find the best events and artists near you
                    </p>
                </div>
            </div>
        </div>
     );
}

export default SearchHero;