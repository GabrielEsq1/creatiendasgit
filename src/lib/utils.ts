import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStoreUrl(slug: string) {
  // IMPORTANT: Always use path-based URLs (creatiendas.co/stores/slug)
  // NOT subdomain URLs (slug.creatiendas.co) - subdomains don't work!

  if (typeof window === 'undefined') {
    // Server-side
    return `https://creatiendas.co/stores/${slug}`;
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production - use path-based URL
  if (hostname.includes('creatiendas.co')) {
    return `https://creatiendas.co/stores/${slug}`;
  }

  // Local development - also use path-based
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return `${protocol}//${hostname}:${window.location.port || '3000'}/stores/${slug}`;
  }

  // Fallback to path-based for Vercel previews or other environments
  return `${window.location.origin}/stores/${slug}`;
}
