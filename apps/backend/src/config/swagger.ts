import { swagger } from "@elysiajs/swagger";
import type { Elysia } from "elysia";
import { config } from "./env";

export const swaggerConfig = () => (app: Elysia) => {
  if (config.ENABLE_SWAGGER) {
    return app.use(
      swagger({
        documentation: {
          info: {
            title: "Custom AI Documentation",
            description: "Development documentation",
            license: { name: "MIT", url: "https://opensource.org/license/mit" },
            termsOfService: "termsOfService",
            version: config.APP_VERSION,
          },
          servers: [
            {
              url: `http://localhost:${config.APP_PORT}`,
              description: "Local server",
            },
          ],
          tags: Object.values({
            auth: { name: "Auth", description: "Authentication endpoints" },
            app: { name: "App", description: "General endpoints" },
            user: { name: "User", description: "User endpoints" },
            setting: { name: "Setting", description: "Setting endpoints" },
            device: {
              name: "Device",
              description: "Device management endpoints",
            },
            permission: {
              name: "Permission",
              description: "Permission endpoints",
            },
            role: { name: "Role", description: "Role endpoints" },
            augmentation: {
              name: "Augmentation",
              description: "CRUD for data augmentation",
            },
            dataset: {
              name: "Dataset",
              description: "CRUD for datasets",
            },
          }),
          components: {
            securitySchemes: {
              accessToken: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
              refreshToken: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
              apiKey: {
                type: "apiKey",
                name: "apiKey",
                in: "header",
              },
            },
          },
        },
        version: config.APP_VERSION,
        provider: "scalar",
        scalarConfig: { theme: "solarized" },
        path: "/docs",
      })
    );
  }
  return app;
};
