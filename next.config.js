/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // dimatikan agar countdown/interval demo tidak double-fire di dev
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

module.exports = nextConfig;
