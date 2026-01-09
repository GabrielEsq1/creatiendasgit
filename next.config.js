/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return {
            beforeFiles: [
                // Subdomain routing: rewrite subdomain.domain.com to /stores/subdomain
                {
                    source: '/:path*',
                    has: [
                        {
                            type: 'host',
                            value: '(?<subdomain>.*)\\.creatiendasgit1\\.vercel\\.app',
                        },
                    ],
                    destination: '/stores/:subdomain/:path*',
                },
            ],
        };
    },
};

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

module.exports = withPWA(nextConfig);
