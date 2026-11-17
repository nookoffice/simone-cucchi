import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: { overrides: { removeViewBox: false } },
                  },
                  "prefixIds",
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
  images: {
    qualities: [50, 65, 75, 90],
  },
};

export default nextConfig;
