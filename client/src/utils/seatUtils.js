import { VIP_ROWS, PRICES } from "../constants/seatConfig";
import { formatVndAmount } from "./formatters";

export const isVip = (row) => VIP_ROWS.includes(row);
export const seatPrice = (row) => (isVip(row) ? PRICES.vip : PRICES.normal);
export const fmt = (n) => formatVndAmount(n, { suffix: " ₫" });
