import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EMPLOYEE: "Employee",
};

export function formatSnakeCase(str: string | undefined): string {
  if (!str) return "";
  
  if (ROLE_LABELS[str.toUpperCase()]) {
    return ROLE_LABELS[str.toUpperCase()];
  }

  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatRole(role: string): string {
  return formatSnakeCase(role);
}

export function formatTime(isoString: string | null | undefined): string {
  if (!isoString) return "--:--";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--:--";
    return format(date, "HH:mm");
  } catch (e) {
    return "--:--";
  }
}

export function formatDateFull(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
