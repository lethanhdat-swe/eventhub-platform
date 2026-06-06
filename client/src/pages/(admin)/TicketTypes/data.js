import {
  DEFAULT_TICKET_COLOR,
  normalizeHexColor,
} from '@/pages/(admin)/TicketTypes/colorUtils';

export { formatPriceVnd } from '@/utils/formatters';

export function mapTicketTypeRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    color: normalizeHexColor(row.color ?? DEFAULT_TICKET_COLOR),
    defaultSeatCount: row.defaultSeatCount ?? 0,
    eventSeatCount: row.eventSeatCount ?? 0,
  };
}
