import { defineConfig } from "drizzle-kit";
export default defineConfig({
	dialect: "postgresql",
	schema: "./src/domains/schema/*",
	out: "./drizzle",
});
// https://orm.drizzle.team/kit-docs/conf#schema-files-paths
