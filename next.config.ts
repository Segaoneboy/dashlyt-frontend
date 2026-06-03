import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites(){
        return [
            {
                source: "/api/:path*",
                //destination: "http://localhost:5000/api/:path*",
                destination: "https://dashlyt-backend.vercel.app/api/:path*",
            }
        ]
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
