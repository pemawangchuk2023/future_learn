import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "p98nprxngq.ufs.sh",
			},
		],
	},
};

export default nextConfig;
