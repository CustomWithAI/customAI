import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/*",
  out: "./drizzle",
});
// https://orm.drizzle.team/kit-docs/conf#schema-files-paths
