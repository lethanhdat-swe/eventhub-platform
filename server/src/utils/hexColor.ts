export const DEFAULT_TICKET_COLOR = "#27272A";

const HEX_SHORT = /^#([0-9A-Fa-f]{3})$/;
const HEX_FULL = /^#([0-9A-Fa-f]{6})$/;

export function isValidHexColor(color: string): boolean {
    const trimmed = color.trim();
    return HEX_SHORT.test(trimmed) || HEX_FULL.test(trimmed);
}

export function normalizeHexColor(color?: string | null): string {
    if (!color || typeof color !== "string") {
        return DEFAULT_TICKET_COLOR;
    }

    let value = color.trim();
    if (!value.startsWith("#")) {
        value = `#${value}`;
    }

    const shortMatch = value.match(HEX_SHORT);
    if (shortMatch) {
        const [, hex] = shortMatch;
        value = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    if (!HEX_FULL.test(value)) {
        return DEFAULT_TICKET_COLOR;
    }

    return value.toUpperCase();
}
