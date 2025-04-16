import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUrl(input: string): string {
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`)
    url.pathname = url.pathname.replace(/\/+$/, "") // remove trailing slashes
    return url.origin
  } catch (error) {
    return "" // invalid URL
  }
}

export function isValidGA4Id(input: string): boolean {
  return /^G-[A-Z0-9]{4,10}$/.test(input.trim().toUpperCase())
}
