/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Les images de produits sont saisies librement dans l'admin (URL externe
    // quelconque), donc l'optimiseur next/image ne peut pas se limiter à une
    // liste d'hôtes fixe sans casser l'affichage des articles.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
