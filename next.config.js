const TerserPlugin = require('terser-webpack-plugin');
const withPWA = require('next-pwa');

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  runtimeCaching: [],
})({
  webpack: (config, { dev, isServer }) => {
    // 개발 서버에서는 Terser 사용 X
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ];
    }

    return config;
  },
  headers: async () => [
    {
      source: '/sound/(.*)\\.mp3',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000',
        },
      ],
    },
  ],
});

module.exports = nextConfig;
