const fetchIndex = require('./fetchIndexPage');

/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    const redirects = [];
    redirects.push({
        source: '/',
        destination: `/startseite`,
        permanent: true,
      })

    return redirects;
  },
  reactStrictMode: true,
  images: {
    domains: ['images.ctfassets.net'],
  },
}
