import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "4566",
				pathname: "/my-bucket/**",
			},
		],
	},
};

const withMDX = createMDX({});

export default withNextIntl(withMDX(nextConfig));
