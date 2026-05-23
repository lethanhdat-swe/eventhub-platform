function EventTickets({ tickets }) {
    return ( 
        <div className="p-5 bg-(--surface-color) rounded-xl mt-4">
            <h1 className="text-(--text-primary)">Ticket Types</h1>
            <div className="mt-3">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-(--background-color)/30 p-5 rounded-xl flex items-start justify-between mt-3">
                        <div className="flex gap-3">
                            <span
                                className="w-2.5 h-2.5 rounded-full mt-2 shrink-0"
                                style={{ backgroundColor: ticket.color }}
                            />
                            <h1 className="text-(--text-primary)">{ticket.name}</h1>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <h1 className="text-(--text-primary)">
                                {ticket.price.toLocaleString('de-DE')} ₫
                            </h1>
                            <p className="text-(--text-primary)/60 text-sm">
                                Seats: {ticket.eventSeatCount ?? ticket.defaultSeatCount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventTickets;