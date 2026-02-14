/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    // Evita che Konva risolva la build Node (che richiede il modulo nativo "canvas")
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "konva/lib/index-node.js": "konva/lib/index.js",
    };
    // Stub canvas lato webpack (non serve nel browser)
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
