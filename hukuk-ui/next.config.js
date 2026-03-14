/** @type {import('next').NextConfig} */
const nextConfig = {
    // API proxy yapılandırması — CORS sorunlarını önler
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:7001/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
