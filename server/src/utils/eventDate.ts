type EventDateFields = {
    startDate?: Date | string | null;
    endDate?: Date | string | null;
};

export function isEventEnded(event: EventDateFields | null | undefined): boolean {
    if (!event) return false;

    const now = new Date();
    const end = event.endDate ? new Date(event.endDate) : null;
    const start = event.startDate ? new Date(event.startDate) : null;

    if (end) return end < now;
    if (start) return start < now;

    return false;
}

export function isEventOngoing(
    event: EventDateFields | null | undefined
): boolean {
    if (!event?.startDate) return false;

    const now = new Date();
    const start = new Date(event.startDate);

    if (start > now) return false;

    return !isEventEnded(event);
}

export function canBookEvent(
    event: EventDateFields | null | undefined
): boolean {
    return !isEventEnded(event) && !isEventOngoing(event);
}
