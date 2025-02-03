import { Elysia, t } from "elysia";
import { AugmentationService } from "@/applications/services/augmentationService";
import { createAugmentationDto } from "@/domains/dtos/augmentation";
import { userMiddleware } from "@/middleware/authMiddleware";
import { paginationDto } from "@/domains/dtos/pagination";

export const augmentation = new Elysia({
  name: "augmentation-controller",
  prefix: "augmentations",
})
  .derive(({ request }) => userMiddleware(request))
  .decorate("augmentationService", new AugmentationService())
  .post(
    "/",
    async ({ user, body, augmentationService }) => {
      return augmentationService.createAugmentation({
        name: body.name,
        data: body.data,
        userId: user.id,
      });
    },
    { body: createAugmentationDto }
  )
  .get(
    "/",
    async ({ user, query, augmentationService }) => {
      return augmentationService.getAugmentationsByUserId(user.id, {
        ...query,
      });
    },
    { query: paginationDto }
  );
// .get("/note", ({ note }) => note.data)
// .get(
//   "/note/:index",
//   ({ note, params: { index }, error }) => {
//     return note.data[index] ?? error(404, "oh no :(");
//   },
//   {
//     params: t.Object({
//       index: t.Number(),
//     }),
//   }
// );
