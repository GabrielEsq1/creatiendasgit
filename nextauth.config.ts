/**
 * nextauth.config.ts
 * NextAuth configuration that forces NEXTAUTH_URL to use NEXTAUTH_URL1
 */

// Force NEXTAUTH_URL before NextAuth initializes
if (typeof window === 'undefined') {
    // Server-side only
    if (process.env.NEXTAUTH_URL1 && !process.env.NEXTAUTH_URL) {
        process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL1;
    }
    if (process.env.NEXTAUTH_SECRET1 && !process.env.NEXTAUTH_SECRET) {
        process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET1;
    }
}
