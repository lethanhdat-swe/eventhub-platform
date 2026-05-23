function EventTickets({ tickets }) {
    return ( 
        <div className="p-4 bg-(--surface-color) rounded-xl mt-4">
            <h1 className="text-(--text-primary) font-medium">Ticket Types</h1>
            <div className="mt-3">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-(--background-color)/30 p-3 rounded-xl flex items-start justify-between gap-3 mt-2.5">
                        <div className="flex gap-3">
                            <span
                                className="w-2.5 h-2.5 rounded-full mt-2 shrink-0"
                                style={{ backgroundColor: ticket.color }}
                            />
                            <h1 className="text-(--text-primary) text-sm font-medium">{ticket.name}</h1>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <h1 className="text-(--text-primary) text-sm font-medium">
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