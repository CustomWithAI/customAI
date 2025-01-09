import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/domains/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_LOCAL_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  },
});
// https://orm.drizzle.team/kit-docs/conf#schema-files-paths
