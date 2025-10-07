/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14, no need for experimental flag
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Optimizaciones de producción
  compress: true,
  swcMinify: true,
  
  // Optimización de imports de librerías grandes
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  
  // Configuración de imágenes
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Headers de caché optimizados
  async headers() {
    return [
      {
        source: '/(.*)\\.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig