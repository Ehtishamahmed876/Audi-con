const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");

const nextConfig = withPlugins([withImages], {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192, // You can adjust the limit as needed
            name: "[name].[ext]",
            publicPath: "/public/audio.mp3",
            outputPath: isServer ? `${__dirname}/public/static/media` : undefined,
          },
        },
      ],
    });

    return config;
  },
});

module.exports = nextConfig;

