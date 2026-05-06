function EventTickets({event}) {
    const VARIANT_STYLES = {
        success: {
            dot:   'bg-green-400',
            badge: 'bg-green-500/15 text-green-400 border-green-500/30',
        },
        warning: {
            dot:   'bg-yellow-400',
            badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        },
        error: {
            dot:   'bg-red-400',
            badge: 'bg-red-500/15 text-red-400 border-red-500/30',
        },
        };
    return ( 
        <div className="p-5 bg-(--surface-color) rounded-xl mt-4">
              <h1 className="text-(--text-primary)">Ticket Types</h1>
              <div className="mt-3">
                {event.ticketTypes.map((ticket, index) => {
                    const style = VARIANT_STYLES[ticket.label.variant];
                  return (
                      <div key={index} className="bg-(--background-color)/30 p-5 rounded-xl flex items-start justify-between mt-3">
                          
                        <div className="flex gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full mt-2 ${style.dot}`} />
                               <div className="flex flex-col gap-3">
                                    <h1 className="text-(--text-primary)">{ticket.name}</h1>

                                    <p className="text-(--text-primary)/60 max-w-75">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                               </div>
                        </div>

                         <div className="flex flex-col gap-1">
                            <h1 className="text-(--text-primary)">${ticket.price.toLocaleString('de-DE')}</h1>

                             <span className={`text-xs px-1 py-0.5 rounded-xs text-center border ${style.badge}`}>
                                {ticket.label.text}
                            </span>

                            <p className="text-(--text-primary)/60 text-sm">Stock: {ticket.stock}</p>
                        </div>
                    </div>
                  )
                })}
              </div>
        </div>
     );
}

export default EventTickets;