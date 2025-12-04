/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
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

module.exports = nextConfig;
