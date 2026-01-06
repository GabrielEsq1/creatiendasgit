import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStoreUrl(slug: string) {
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://creatiendas.co';
    if (baseUrl.includes('creatiendas.co')) return `https://${slug}.creatiendas.co`;
    return `${baseUrl}/stores/${slug}`;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production
  if (hostname.includes('creatiendas.co')) {
    return `${protocol}//${slug}.creatiendas.co`;
  }

  // Local development
  if (hostname.includes('localhost')) {
    return `${protocol}//${slug}.localhost:3000`;
  }

  // Fallback to path-based for Vercel previews or other environments
  return `${window.location.origin}/stores/${slug}`;
}
