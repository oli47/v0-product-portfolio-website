/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  // Lets a check build write somewhere other than `.next`, so it cannot pull the
  // rug out from under a dev server running in the same directory.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // The browser's Save dialog names the file after the URL, so the resume
  // lives under the name a recruiter should end up with. The old path stays
  // alive for links already sent out.
  async redirects() {
    return [
      { source: '/olaf-resume.pdf', destination: '/Olaf-Otrzasek-Senior-Product-Designer-CV.pdf', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ]
  },
}

export default nextConfig
