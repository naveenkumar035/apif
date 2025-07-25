/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },
}

module.exports = {
  webpack: (config, { isServer }) => {
    // Add the Python loader
    config.module.rules.push({
      test: /\.py$/,
      use: ['raw-loader', './python-loader.js'],
    });

    // Other configuration options...
    
    return config;
  },
};
