// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = { nextConfig, images: {loader: "custom"}}


/**
   * @type {import('next').NextConfig}
   */
 const nextConfig   = {
  images: {
    loader: 'akamai',
    path: '',
  },
  assetPrefix: './',
};

export default   nextConfig;