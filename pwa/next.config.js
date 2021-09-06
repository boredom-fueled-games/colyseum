module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    NEXT_PUBLIC_ENTRYPOINT: process.env.NEXT_PUBLIC_ENTRYPOINT || 'http://localhost',
  },
};
