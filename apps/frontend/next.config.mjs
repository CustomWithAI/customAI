import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import rehypeSlug from "rehype-slug";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	experimental: {
		webpackBuildWorker: true,
		parallelServerBuildTraces: true,
		parallelServerCompiles: true,
	},
	output: "standalone",
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "4566",
				pathname: "/my-bucket/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/images/**",
			},
		],
	},
	transpilePackages: ["next-mdx-remote"],
	webpack: (config) => {
		config.resolve.fallback = { fs: false, path: false, crypto: false };
		return config;
	},
};

const withMDX = createMDX({
	extension: /\.mdx?$/,
	options: {
		format: "mdx",
		remarkPlugins: [],
		rehypePlugins: [rehypeSlug],
	},
});

export default withNextIntl(withMDX(nextConfig));
