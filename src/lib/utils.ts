import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"

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
