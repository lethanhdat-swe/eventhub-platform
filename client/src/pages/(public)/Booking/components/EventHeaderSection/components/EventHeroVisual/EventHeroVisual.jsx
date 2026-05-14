import { images } from "@/assets";

function EventHeroVisual() {
    return ( 
         <div className="flex items-center justify-center overflow-hidden rounded-xl">
        <img
          src={images.home}
          alt=""
          className="object-cover w-full h-full transition-transform duration-500 rounded-xl hover:scale-105"
        />
      </div>
     );
}

export default EventHeroVisual;