const TerserPlugin = require('terser-webpack-plugin');

const nextConfig = {
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
};

module.exports = nextConfig;
