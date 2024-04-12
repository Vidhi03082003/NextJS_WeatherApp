// next.config.mjs


const config = {
  env: {
    WEATHER_KEY: process.env.WEATHER_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org'
      },
    ],
  },
};

export default config;
