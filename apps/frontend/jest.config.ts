import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
	coverageProvider: "v8",
	setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
	transform: {
		"^.+\\.(t|j)sx?$": ["@swc/jest"] as unknown as string,
	},
	testEnvironment: "jsdom",
	moduleNameMapper: {
		// ...
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
