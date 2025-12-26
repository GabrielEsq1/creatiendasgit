/**
 * Override NEXTAUTH_URL to use NEXTAUTH_URL1 if available
 * This is needed because we have multiple projects sharing environment variables
 */
if (process.env.NEXTAUTH_URL1 && !process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL1;
}

if (process.env.NEXTAUTH_SECRET1 && !process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET1;
}

module.exports = {};
