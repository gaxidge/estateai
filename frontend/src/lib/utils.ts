import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactTRY(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `₺${millions.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} Mn`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return `₺${thousands.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} Bin`;
  }
  return formatTRY(amount);
}

export function formatDateTR(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateTimeTR(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
