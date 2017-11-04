export const SERVER_URL =
  process.env.SERVER === 'webpack-dev' ? 'http://localhost:5000' : window.location.origin;
