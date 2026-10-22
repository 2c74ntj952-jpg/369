import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely fetch and parse JSON without throwing DOM Exception 12 or SyntaxError
 * when server returns HTML errors, 500 pages, or unexpected payloads.
 */
export async function safeFetchJson<T = any>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res || !res.ok) return null;
    const contentType = res.headers?.get?.('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    const text = await res.text();
    if (!text || !text.trim()) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
