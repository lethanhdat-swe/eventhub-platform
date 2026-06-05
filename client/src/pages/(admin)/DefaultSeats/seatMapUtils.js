import {
  DEFAULT_TICKET_COLOR,
  normalizeHexColor,
} from '@/pages/(admin)/TicketTypes/colorUtils';

export const UNASSIGNED_COLOR = '#d4d4d8';

export const STAGE_LABEL = 'SÂN KHẤU';

export function formatSeatCode(rowLabel, seatNumber) {
  return `${rowLabel}${seatNumber}`;
}

export function getSeatTicketTypeColor(seat) {
  if (!seat.defaultTicketTypeId) return null;
  const fromType = seat.defaultTicketType?.color;
  if (fromType) return normalizeHexColor(fromType);
  return normalizeHexColor(DEFAULT_TICKET_COLOR);
}

/** @deprecated use getSeatTicketTypeColor */
export function getTicketTypeColor(ticketTypeId, ticketType) {
  if (!ticketTypeId) return null;
  if (ticketType?.color) return normalizeHexColor(ticketType.color);
  return normalizeHexColor(DEFAULT_TICKET_COLOR);
}

export function groupSeatsByRow(seats) {
  const byRow = new Map();
  for (const seat of seats) {
    const row = seat.rowLabel ?? '';
    if (!byRow.has(row)) byRow.set(row, []);
    byRow.get(row).push(seat);
  }
  return [...byRow.entries()]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(([rowLabel, rowSeats]) => ({
      rowLabel,
      seats: [...rowSeats].sort((a, b) => a.seatNumber - b.seatNumber),
    }));
}

export function getTicketTypeOptions(seats) {
  const map = new Map();
  let hasUnassigned = false;
  for (const seat of seats) {
    if (!seat.defaultTicketTypeId) {
      hasUnassigned = true;
      continue;
    }
    const t = seat.defaultTicketType;
    if (t && !map.has(t.id)) {
      map.set(t.id, {
        id: t.id,
        name: t.name,
        color: getSeatTicketTypeColor(seat),
      });
    }
  }
  const items = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  if (hasUnassigned) {
    items.push({
      id: '__unassigned',
      name: 'Chưa gán',
      color: UNASSIGNED_COLOR,
    });
  }
  return items;
}
