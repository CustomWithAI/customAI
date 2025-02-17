import { Elysia } from "elysia";
import { customModelService } from "@/config/dependencies";
import {
  createCustomModelDto,
  updateCustomModelDto,
} from "@/domains/dtos/customModel";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";

export const customModel = new Elysia({
  name: "custom-model-controller",
  prefix: "custom-models",
  detail: {
    tags: ["Custom Model"],
  },
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("customModelService", customModelService)
  .post(
    "/",
    async ({ user, body, customModelService }) => {
      return customModelService.createCustomModel({
        ...body,
        userId: user.id,
      });
    },
    { body: createCustomModelDto }
  )
  .get(
    "/",
    async ({ user, query, customModelService }) => {
      return customModelService.getCustomModelsByUserId(user.id, query);
    },
    { query: paginationDto }
  )
  .get("/:id", async ({ user, params, customModelService }) => {
    return customModelService.getCustomModelById(user.id, params.id);
  })
  .put(
    "/:id",
    async ({ user, params, body, customModelService }) => {
      return customModelService.updateCustomModel(user.id, params.id, body);
    },
    { body: updateCustomModelDto }
  )
  .delete("/:id", async ({ user, params, customModelService }) => {
    return customModelService.deleteCustomModel(user.id, params.id);
  });
