
function EventAbout({ event }) {
    return ( 
        <div className="p-4 border-t-2 border-(--text-primary)/30">
            <div>
                <h1 className="text-(--text-primary) text-xl">About This Event</h1>

            <p className="text-(--text-primary)/60 pt-3">{event.desc}</p>
            </div>

            <div className="flex items-center justify-between ">
               {event.features.map((feature,index) => (
                    <span key={index} className="bg-gray-500/20 rounded-xl text-(--text-primary) p-4 mt-3">{feature}</span>
               ))}
            </div>
        </div>
     );
}

export default EventAbout;