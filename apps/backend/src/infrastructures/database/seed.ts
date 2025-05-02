import { config } from "@/config/env";
import { logger } from "@/config/logger";
import { augmentations } from "@/domains/schema/augmentations";
import { account, session, user, verification } from "@/domains/schema/auth";
import { datasets } from "@/domains/schema/datasets";
import { imagePreprocessings } from "@/domains/schema/imagePreprocessings";
import { images } from "@/domains/schema/images";
import { workflows } from "@/domains/schema/workflows";
import { cleanupDB } from "@/utils/db-utils";
import { randomUUIDv7 } from "bun";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(
  `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_LOCAL_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`
);

export async function seedAuth(): Promise<void> {
  logger.info("🌱 Seeding auth data...");
  await db.transaction(async (context) => {
    await cleanupDB(context, session);
    await cleanupDB(context, verification);
    await cleanupDB(context, account);
    await cleanupDB(context, user);
    await cleanupDB(context, datasets);
    await cleanupDB(context, workflows);
    await cleanupDB(context, imagePreprocessings);
    await cleanupDB(context, augmentations);
    logger.info("🧹 Cleaned up the database...");

    const userId = "nS2tgN5GuNguqywEy6yo1OIOVjhggrHQ";

    const sampleUsers = [
      {
        id: userId,
        name: "Admin CustomAI",
        email: "admin@customai.com",
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "user",
      },
    ];

    const sampleAccounts = [
      {
        id: "8VFecYXIXy5sOsDEmT8OOswlMaz8ekuw",
        accountId: userId,
        providerId: "credential",
        userId: userId,
        // admin123
        password:
          "5f55c4c21a402477c290868ceb561741:892d56d7a200cd6e5a21c57bbfc9bd412d7b456e162a5b1837efdd0546dcdaf26875569213aaeaad269da2e084f023a39c89ed684295e9abd4e26fbab4d95286",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const classificationDatasetId = randomUUIDv7();
    const objectDetectionDatasetId = randomUUIDv7();
    const segmentationDatasetId = randomUUIDv7();
    const classificationWorkflowId = randomUUIDv7();
    const objectDetectionWorkflowId = randomUUIDv7();
    const segmentationWorkflowId = randomUUIDv7();
    const now = new Date();

    const sampleDatasets = [
      {
        id: classificationDatasetId,
        name: "Classification Sample Dataset",
        description: "Food Dataset For Classification Training",
        annotationMethod: "classification",
        splitMethod: "default",
        labels: [
          {
            name: "Chinese",
            color: "#22c55e",
          },
          {
            name: "Thai",
            color: "#a855f7",
          },
          {
            name: "Japanese",
            color: "#6366f1",
          },
          {
            name: "American",
            color: "#fd464a",
          },
        ],
        train: 70,
        test: 15,
        valid: 15,
        createdAt: now,
        updatedAt: now,
        userId,
      },
      {
        id: objectDetectionDatasetId,
        name: "Object Detection Sample Dataset",
        description: "Car and Motorcycle Dataset For Object Detection Training",
        annotationMethod: "object_detection",
        splitMethod: "default",
        labels: [
          { name: "Car", color: "#84cc16" },
          { name: "Motorcycle", color: "#ec4899" },
        ],
        train: 70,
        test: 20,
        valid: 10,
        createdAt: now,
        updatedAt: now,
        userId,
      },
      {
        id: segmentationDatasetId,
        name: "Segmentation Sample Dataset",
        description: "Dog and Cat Dataset For Segmentation Training",
        annotationMethod: "segmentation",
        splitMethod: "default",
        labels: [
          { name: "Cat", color: "#14b8a6" },
          { name: "Dog", color: "#d0d0d0" },
        ],
        train: 60,
        test: 20,
        valid: 20,
        createdAt: now,
        updatedAt: now,
        userId,
      },
    ];

    const sampleWorkflows = [
      {
        id: classificationWorkflowId,
        name: "Classification Sample Workflow",
        description: "Food Workflow For Classification Training",
        type: "classification",
        createdAt: now,
        updatedAt: now,
        userId: userId,
      },
      {
        id: objectDetectionWorkflowId,
        name: "Object Detection Sample Workflow",
        description:
          "Car and Motorcycle Workflow For Object Detection Training",
        type: "object_detection",
        createdAt: now,
        updatedAt: now,
        userId: userId,
      },
      {
        id: segmentationWorkflowId,
        name: "Segmentation Sample Workflow",
        description: "Dog and Cat Workflow For Segmentation Training",
        type: "segmentation",
        createdAt: now,
        updatedAt: now,
        userId: userId,
      },
    ];

    const sampleImages = [
      {
        path: "datasets/classification/01968dc0-a8fe-763a-948b-9449a49bd5d1.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-a97c-7517-9eb4-013223a8776f.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-a9a1-715c-9ab3-10ae731007ca.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-a9c7-70a4-a7b8-8c5a42a706f3.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-a9e4-77ce-a6c9-19a222972235.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-aa26-7308-a706-cac8377648c9.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-aa40-769e-a891-39f1f0d6b138.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ab00-71e0-9fff-5b0a63503933.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ab1f-70dd-8aec-a999ef1ca9a6.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ab5f-750e-932b-eb38894d141c.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ab8d-740a-958b-73becb14f891.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-abc5-75bf-97f3-98ed9e2d2b04.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-abec-762c-8bd8-47f5fc687090.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ac38-753f-9c5f-e2ea612b9a77.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ac8a-7424-bb92-7c5640b1b43f.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-acd5-7063-b860-9b29014fd792.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ad35-77a7-b7c7-ef8f283dd00c.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ad6d-751b-82b0-9d8d15127b5e.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-adaf-7475-9f83-99a256ec6c18.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-adf3-76b6-b9b1-bbd112c2c787.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ae7b-7529-985c-48c1eac2a4c6.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-aeb6-70fc-9bf4-b3ac7e6294a5.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-af05-74bb-81f1-bb9150fc5f94.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-af4c-7618-8967-8ee97232a50f.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-afa4-775a-b51c-43d845457fc2.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-afea-706b-8e19-fffccf0ec087.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b03f-70cc-8d9b-3a80a8f3b957.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b08a-70f3-a2cb-91eefae58546.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b0fe-752c-b6d3-6ed775160f07.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b129-70c5-ba7d-7033960a615b.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b1b9-7094-9441-d0a48bb4b086.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b1fa-76eb-ac56-b5c9b0b31f36.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b24c-76f2-b74a-9415f4a45ce2.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b2ab-7155-819a-7b758509c7ff.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b319-71cf-a082-6ee22e3240c6.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b385-7146-92a8-d7a28d54899d.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b3ee-74e9-ac9a-c968e2aa6865.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b46d-72aa-85a0-f6c041856932.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b4c2-768b-a879-f51ade765c52.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b510-72ce-9d27-2ac7e3f62d82.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b559-758c-b0c5-49e4914f0d78.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b621-7788-9b9a-b9c6ef075ba3.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b709-73b7-8279-e2bfff9708da.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b73d-777c-bc1d-e75b33583983.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b799-77e8-a54d-f8164f1a99c9.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b826-728b-83c5-cf53a6fa5a14.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b889-721d-9571-8660e8c55743.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b919-7442-98e7-8a7ce900c951.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-b988-75d2-9455-32d772362359.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-ba12-76fb-9551-65d5528ff984.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-baa1-703e-a0d3-23b0545f1d34.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bb2e-7418-8003-98523778fd25.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bb8f-713c-b040-c3679a37e94f.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bbf6-70cc-bc26-c5f61194908d.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bc84-7088-94b6-4a9c8b4d491f.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bcd8-74af-8e1c-03ab0bcada75.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bd40-70fe-a2aa-bce11ff558f0.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bdcb-729c-b791-b9f3f53ec9c1.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-be73-746b-83c8-29af0b91bf60.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bee4-7744-b943-7e35db3cccd4.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bf77-73af-8231-f99ce7062040.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-bfda-724b-a857-798701344e2e.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c09c-7156-97ef-1b4e1f98d9c9.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c130-75bc-8ebb-87d57b0b2cd5.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c1f3-7233-9e72-902d5ac4c3f3.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c242-71b3-ba93-47688c6d0808.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c2ce-727d-88c4-bf1b49a21925.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c341-7488-acc8-6a859ede65dd.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c3f2-726c-b90b-35360aee28f6.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c436-718e-bd1e-a04ea35c5ab8.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c48b-7568-a3f4-3d1074452a7d.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c4fb-7212-8233-9768bd48bb10.jpg",
        annotation: {
          label: "Japanese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c55b-7171-b14a-5b849233ec19.jpg",
        annotation: {
          label: "Thai",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c57a-7779-8672-6035f45e2ae8.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c58f-73da-b7ce-28530d56b65a.jpg",
        annotation: {
          label: "Chinese",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c5b6-776f-b857-b27baef0a7b7.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c5cb-75f5-a2b3-8aa0c630771b.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c5e4-747e-8711-3d00a6724090.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c614-77ba-86c7-2fdd39395719.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/classification/01968dc0-c63a-754a-933f-097a9f82799d.jpg",
        annotation: {
          label: "American",
        },
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-184c-70aa-91b9-66d8c8eac937.jpg",
        annotation: {
          annotation: [
            {
              x: 2,
              y: 187.5,
              label: "Car",
              width: 196,
              height: 116,
            },
            {
              x: 434,
              y: 181.5,
              label: "Car",
              width: 213,
              height: 134,
            },
            {
              x: 213,
              y: 170.5,
              label: "Motorcycle",
              width: 217,
              height: 183,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1897-7749-a41c-324225bc3b89.jpg",
        annotation: {
          annotation: [
            {
              x: 65.5,
              y: 20,
              label: "Motorcycle",
              width: 393,
              height: 219,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-18ea-7013-adb0-bc700384524c.jpg",
        annotation: {
          annotation: [
            {
              x: 87,
              y: 11,
              label: "Motorcycle",
              width: 418,
              height: 344,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-19df-70fc-9d21-a7984858f1da.jpg",
        annotation: {
          annotation: [
            {
              x: 81.5,
              y: 89,
              label: "Car",
              width: 427,
              height: 192,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1a12-77a0-9004-5f35d32d8ec7.jpg",
        annotation: {
          annotation: [
            {
              x: 24,
              y: 166,
              label: "Car",
              width: 562,
              height: 280,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1a92-7579-b12d-5a0114c9472f.jpg",
        annotation: {
          annotation: [
            {
              x: 105,
              y: 3.5,
              label: "Motorcycle",
              width: 264,
              height: 250,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1ac2-77a8-b6cf-558fd08a8727.jpg",
        annotation: {
          annotation: [
            {
              x: 274,
              y: 700,
              label: "Motorcycle",
              width: 708,
              height: 724,
            },
            {
              x: 964,
              y: 846,
              label: "Car",
              width: 835,
              height: 407,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1b29-75f6-8751-ba256e4e3cd6.jpg",
        annotation: {
          annotation: [
            {
              x: 100,
              y: 84,
              label: "Car",
              width: 453,
              height: 213,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1b49-7514-bbcf-7ceed20b5df9.jpg",
        annotation: {
          annotation: [
            {
              x: 9,
              y: 10.5,
              label: "Motorcycle",
              width: 594,
              height: 530,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1b77-7552-8edb-6667fb09d863.jpg",
        annotation: {
          annotation: [
            {
              x: 114,
              y: 122,
              label: "Car",
              width: 510,
              height: 348,
            },
            {
              x: 697,
              y: 113,
              label: "Motorcycle",
              width: 193,
              height: 317,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1bb6-7769-9c38-d2fa0f04ab8d.jpg",
        annotation: {
          annotation: [
            {
              x: 32,
              y: 145.5,
              label: "Car",
              width: 581,
              height: 246,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1bd9-76b9-8b54-a0a886da7988.jpg",
        annotation: {
          annotation: [
            {
              x: 109,
              y: 56,
              label: "Motorcycle",
              width: 512,
              height: 319,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1c07-775b-8a0a-4a37be9dfb5d.jpg",
        annotation: {
          annotation: [
            {
              x: 423,
              y: 262,
              label: "Car",
              width: 674,
              height: 227,
            },
            {
              x: 148,
              y: 144,
              label: "Motorcycle",
              width: 291,
              height: 388,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1ca6-779f-be34-546700785ba4.jpg",
        annotation: {
          annotation: [
            {
              x: 49,
              y: 244,
              label: "Car",
              width: 284,
              height: 120,
            },
            {
              x: 384,
              y: 247,
              label: "Motorcycle",
              width: 237,
              height: 137,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1cde-7022-af3b-22a9eb975a59.jpg",
        annotation: {
          annotation: [
            {
              x: 32,
              y: 98.5,
              label: "Car",
              width: 569,
              height: 235,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1d25-77b3-bf0f-2f9635a2cccc.jpg",
        annotation: {
          annotation: [
            {
              x: 52,
              y: 133,
              label: "Motorcycle",
              width: 470,
              height: 411,
            },
            {
              x: 534,
              y: 262,
              label: "Car",
              width: 414,
              height: 179,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1d68-7516-a81e-cafa15764ea5.jpg",
        annotation: {
          annotation: [
            {
              x: 135,
              y: 209,
              label: "Car",
              width: 1338,
              height: 653,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1dde-7413-a295-e60ef5b8d245.jpg",
        annotation: {
          annotation: [
            {
              x: 233,
              y: 137,
              label: "Car",
              width: 304,
              height: 172,
            },
            {
              x: 89,
              y: 97,
              label: "Motorcycle",
              width: 127,
              height: 209,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1e22-772e-a66a-1826bd6d60c4.jpg",
        annotation: {
          annotation: [
            {
              x: 652,
              y: 271,
              label: "Car",
              width: 408,
              height: 259,
            },
            {
              x: 261,
              y: 245,
              label: "Motorcycle",
              width: 210,
              height: 314,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1ec9-7741-8f41-396e74043d59.jpg",
        annotation: {
          annotation: [
            {
              x: 153,
              y: 210.5,
              label: "Car",
              width: 1073,
              height: 496,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1f57-76e8-a27a-cfe0495e12b1.jpg",
        annotation: {
          annotation: [
            {
              x: 138,
              y: 166,
              label: "Car",
              width: 714,
              height: 285,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1f9b-71e2-a573-d604c4ddfff7.jpg",
        annotation: {
          annotation: [
            {
              x: 5,
              y: 72.5,
              label: "Motorcycle",
              width: 570,
              height: 359,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-1fd0-756a-b193-fb155d4a6538.jpg",
        annotation: {
          annotation: [
            {
              x: 276,
              y: 59,
              label: "Car",
              width: 157,
              height: 100,
            },
            {
              x: 45,
              y: 74,
              label: "Motorcycle",
              width: 221,
              height: 128,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-2013-748e-b90f-e8566310f788.jpg",
        annotation: {
          annotation: [
            {
              x: 92,
              y: 228,
              label: "Car",
              width: 827,
              height: 255,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-20c6-714f-ab4c-7a54ca119c07.jpg",
        annotation: {
          annotation: [
            {
              x: 978.5112429887821,
              y: 488.51600060096155,
              label: "Motorcycle",
              width: 1594.8717948717947,
              height: 1279.4871794871794,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-234b-7057-ba18-a923144486c5.jpg",
        annotation: {
          annotation: [
            {
              x: 966,
              y: 420.5,
              label: "Motorcycle",
              width: 3812,
              height: 2664,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-2530-77af-9212-37feda29f272.jpg",
        annotation: {
          annotation: [
            {
              x: 790,
              y: 436,
              label: "Motorcycle",
              width: 1410,
              height: 1276,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-25e6-740b-a5be-c757940a2037.jpg",
        annotation: {
          annotation: [
            {
              x: 42.5,
              y: 151,
              label: "Car",
              width: 413,
              height: 231,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-2674-758a-9ecc-789912e95bec.jpg",
        annotation: {
          annotation: [
            {
              x: 24,
              y: 80,
              label: "Car",
              width: 546,
              height: 233,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/object-detection/01968cee-270c-77ee-b252-3d751277d217.jpg",
        annotation: {
          annotation: [
            {
              x: 85,
              y: 192,
              label: "Car",
              width: 359,
              height: 196,
            },
            {
              x: 396,
              y: 126,
              label: "Car",
              width: 109,
              height: 53,
            },
            {
              x: 496,
              y: 128,
              label: "Car",
              width: 230,
              height: 118,
            },
            {
              x: 514,
              y: 292,
              label: "Motorcycle",
              width: 243,
              height: 215,
            },
            {
              x: 767,
              y: 294,
              label: "Motorcycle",
              width: 225,
              height: 227,
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8adf-76df-8657-2c0713c3a5d5.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 195,
                  y: 513.5,
                },
                {
                  x: 172,
                  y: 508.5,
                },
                {
                  x: 147,
                  y: 492.5,
                },
                {
                  x: 112,
                  y: 472.5,
                },
                {
                  x: 85,
                  y: 441.5,
                },
                {
                  x: 74,
                  y: 420.5,
                },
                {
                  x: 60,
                  y: 392.5,
                },
                {
                  x: 51,
                  y: 355.5,
                },
                {
                  x: 61,
                  y: 334.5,
                },
                {
                  x: 75,
                  y: 322.5,
                },
                {
                  x: 95,
                  y: 307.5,
                },
                {
                  x: 112,
                  y: 279.5,
                },
                {
                  x: 137,
                  y: 251.5,
                },
                {
                  x: 166,
                  y: 244.5,
                },
                {
                  x: 238,
                  y: 242.5,
                },
                {
                  x: 293,
                  y: 234.5,
                },
                {
                  x: 351,
                  y: 233.5,
                },
                {
                  x: 422,
                  y: 233.5,
                },
                {
                  x: 486,
                  y: 238.5,
                },
                {
                  x: 548,
                  y: 240.5,
                },
                {
                  x: 581,
                  y: 232.5,
                },
                {
                  x: 610,
                  y: 212.5,
                },
                {
                  x: 614,
                  y: 203.5,
                },
                {
                  x: 614,
                  y: 187.5,
                },
                {
                  x: 611,
                  y: 173.5,
                },
                {
                  x: 609,
                  y: 153.5,
                },
                {
                  x: 611,
                  y: 128.5,
                },
                {
                  x: 627,
                  y: 129.5,
                },
                {
                  x: 642,
                  y: 139.5,
                },
                {
                  x: 661,
                  y: 162.5,
                },
                {
                  x: 695,
                  y: 161.5,
                },
                {
                  x: 725,
                  y: 161.5,
                },
                {
                  x: 737,
                  y: 137.5,
                },
                {
                  x: 771,
                  y: 119.5,
                },
                {
                  x: 766,
                  y: 139.5,
                },
                {
                  x: 762,
                  y: 175.5,
                },
                {
                  x: 762,
                  y: 212.5,
                },
                {
                  x: 762,
                  y: 240.5,
                },
                {
                  x: 749,
                  y: 274.5,
                },
                {
                  x: 736,
                  y: 292.5,
                },
                {
                  x: 726,
                  y: 300.5,
                },
                {
                  x: 734,
                  y: 313.5,
                },
                {
                  x: 755,
                  y: 318.5,
                },
                {
                  x: 784,
                  y: 320.5,
                },
                {
                  x: 814,
                  y: 321.5,
                },
                {
                  x: 840,
                  y: 310.5,
                },
                {
                  x: 874,
                  y: 304.5,
                },
                {
                  x: 903,
                  y: 308.5,
                },
                {
                  x: 912,
                  y: 317.5,
                },
                {
                  x: 921,
                  y: 332.5,
                },
                {
                  x: 916,
                  y: 348.5,
                },
                {
                  x: 907,
                  y: 363.5,
                },
                {
                  x: 891,
                  y: 368.5,
                },
                {
                  x: 870,
                  y: 361.5,
                },
                {
                  x: 848,
                  y: 362.5,
                },
                {
                  x: 818,
                  y: 361.5,
                },
                {
                  x: 813,
                  y: 368.5,
                },
                {
                  x: 372,
                  y: 360.5,
                },
                {
                  x: 359,
                  y: 372.5,
                },
                {
                  x: 347,
                  y: 377.5,
                },
                {
                  x: 332,
                  y: 375.5,
                },
                {
                  x: 312,
                  y: 370.5,
                },
                {
                  x: 294,
                  y: 366.5,
                },
                {
                  x: 277,
                  y: 361.5,
                },
                {
                  x: 251,
                  y: 358.5,
                },
                {
                  x: 223,
                  y: 357.5,
                },
                {
                  x: 199,
                  y: 358.5,
                },
                {
                  x: 184,
                  y: 373.5,
                },
                {
                  x: 168,
                  y: 386.5,
                },
                {
                  x: 160,
                  y: 403.5,
                },
                {
                  x: 155,
                  y: 413.5,
                },
                {
                  x: 165,
                  y: 423.5,
                },
                {
                  x: 171,
                  y: 434.5,
                },
                {
                  x: 173,
                  y: 447.5,
                },
                {
                  x: 170,
                  y: 457.5,
                },
                {
                  x: 178,
                  y: 463.5,
                },
                {
                  x: 192,
                  y: 474.5,
                },
                {
                  x: 205,
                  y: 486.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8b20-73dd-9e28-50c4f338160e.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 117,
                  y: 423.5,
                },
                {
                  x: 114,
                  y: 389.5,
                },
                {
                  x: 111,
                  y: 350.5,
                },
                {
                  x: 115,
                  y: 326.5,
                },
                {
                  x: 114,
                  y: 288.5,
                },
                {
                  x: 106,
                  y: 261.5,
                },
                {
                  x: 106,
                  y: 233.5,
                },
                {
                  x: 96,
                  y: 198.5,
                },
                {
                  x: 80,
                  y: 174.5,
                },
                {
                  x: 73,
                  y: 134.5,
                },
                {
                  x: 75,
                  y: 102.5,
                },
                {
                  x: 76,
                  y: 69.5,
                },
                {
                  x: 94,
                  y: 54.5,
                },
                {
                  x: 119,
                  y: 61.5,
                },
                {
                  x: 154,
                  y: 80.5,
                },
                {
                  x: 179,
                  y: 105.5,
                },
                {
                  x: 201,
                  y: 125.5,
                },
                {
                  x: 227,
                  y: 139.5,
                },
                {
                  x: 255,
                  y: 131.5,
                },
                {
                  x: 286,
                  y: 124.5,
                },
                {
                  x: 320,
                  y: 119.5,
                },
                {
                  x: 325,
                  y: 102.5,
                },
                {
                  x: 334,
                  y: 82.5,
                },
                {
                  x: 346,
                  y: 59.5,
                },
                {
                  x: 354,
                  y: 30.5,
                },
                {
                  x: 374,
                  y: 11.5,
                },
                {
                  x: 388,
                  y: 5.5,
                },
                {
                  x: 401,
                  y: 31.5,
                },
                {
                  x: 412,
                  y: 75.5,
                },
                {
                  x: 414,
                  y: 107.5,
                },
                {
                  x: 412,
                  y: 135.5,
                },
                {
                  x: 428,
                  y: 161.5,
                },
                {
                  x: 450,
                  y: 191.5,
                },
                {
                  x: 473,
                  y: 227.5,
                },
                {
                  x: 486,
                  y: 254.5,
                },
                {
                  x: 493,
                  y: 298.5,
                },
                {
                  x: 489,
                  y: 334.5,
                },
                {
                  x: 476,
                  y: 363.5,
                },
                {
                  x: 464,
                  y: 383.5,
                },
                {
                  x: 474,
                  y: 404.5,
                },
                {
                  x: 486,
                  y: 420.5,
                },
                {
                  x: 492,
                  y: 426.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8b36-7142-9dbc-c91a4cd09f49.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 76,
                  y: 424.5,
                },
                {
                  x: 64,
                  y: 399.5,
                },
                {
                  x: 54,
                  y: 367.5,
                },
                {
                  x: 55,
                  y: 336.5,
                },
                {
                  x: 64,
                  y: 302.5,
                },
                {
                  x: 71,
                  y: 262.5,
                },
                {
                  x: 78,
                  y: 224.5,
                },
                {
                  x: 91,
                  y: 191.5,
                },
                {
                  x: 101,
                  y: 151.5,
                },
                {
                  x: 113,
                  y: 120.5,
                },
                {
                  x: 125,
                  y: 99.5,
                },
                {
                  x: 125,
                  y: 75.5,
                },
                {
                  x: 129,
                  y: 52.5,
                },
                {
                  x: 135,
                  y: 29.5,
                },
                {
                  x: 143,
                  y: 11.5,
                },
                {
                  x: 151,
                  y: 1.5,
                },
                {
                  x: 179,
                  y: 1.5,
                },
                {
                  x: 191,
                  y: 11.5,
                },
                {
                  x: 212,
                  y: 49.5,
                },
                {
                  x: 227,
                  y: 76.5,
                },
                {
                  x: 243,
                  y: 68.5,
                },
                {
                  x: 274,
                  y: 65.5,
                },
                {
                  x: 287,
                  y: 62.5,
                },
                {
                  x: 312,
                  y: 33.5,
                },
                {
                  x: 333,
                  y: 8.5,
                },
                {
                  x: 348,
                  y: 2.5,
                },
                {
                  x: 354,
                  y: 15.5,
                },
                {
                  x: 349,
                  y: 63.5,
                },
                {
                  x: 343,
                  y: 86.5,
                },
                {
                  x: 342,
                  y: 98.5,
                },
                {
                  x: 364,
                  y: 121.5,
                },
                {
                  x: 380,
                  y: 152.5,
                },
                {
                  x: 381,
                  y: 180.5,
                },
                {
                  x: 380,
                  y: 203.5,
                },
                {
                  x: 376,
                  y: 225.5,
                },
                {
                  x: 373,
                  y: 248.5,
                },
                {
                  x: 366,
                  y: 265.5,
                },
                {
                  x: 382,
                  y: 281.5,
                },
                {
                  x: 423,
                  y: 306.5,
                },
                {
                  x: 447,
                  y: 330.5,
                },
                {
                  x: 466,
                  y: 361.5,
                },
                {
                  x: 477,
                  y: 389.5,
                },
                {
                  x: 487,
                  y: 422.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8b49-75d8-94e1-22b1c6ca126b.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 4,
                  y: 271.5,
                },
                {
                  x: 22,
                  y: 249.5,
                },
                {
                  x: 46,
                  y: 223.5,
                },
                {
                  x: 92,
                  y: 200.5,
                },
                {
                  x: 122,
                  y: 187.5,
                },
                {
                  x: 115,
                  y: 166.5,
                },
                {
                  x: 98,
                  y: 142.5,
                },
                {
                  x: 94,
                  y: 121.5,
                },
                {
                  x: 94,
                  y: 103.5,
                },
                {
                  x: 106,
                  y: 91.5,
                },
                {
                  x: 126,
                  y: 93.5,
                },
                {
                  x: 166,
                  y: 111.5,
                },
                {
                  x: 191,
                  y: 116.5,
                },
                {
                  x: 231,
                  y: 107.5,
                },
                {
                  x: 272,
                  y: 95.5,
                },
                {
                  x: 304,
                  y: 84.5,
                },
                {
                  x: 326,
                  y: 61.5,
                },
                {
                  x: 352,
                  y: 31.5,
                },
                {
                  x: 368,
                  y: 7.5,
                },
                {
                  x: 382,
                  y: 0.5,
                },
                {
                  x: 399,
                  y: 11.5,
                },
                {
                  x: 403,
                  y: 34.5,
                },
                {
                  x: 404,
                  y: 57.5,
                },
                {
                  x: 408,
                  y: 77.5,
                },
                {
                  x: 413,
                  y: 109.5,
                },
                {
                  x: 424,
                  y: 125.5,
                },
                {
                  x: 448,
                  y: 143.5,
                },
                {
                  x: 462,
                  y: 169.5,
                },
                {
                  x: 472,
                  y: 203.5,
                },
                {
                  x: 472,
                  y: 256.5,
                },
                {
                  x: 463,
                  y: 296.5,
                },
                {
                  x: 446,
                  y: 316.5,
                },
                {
                  x: 445,
                  y: 338.5,
                },
                {
                  x: 452,
                  y: 368.5,
                },
                {
                  x: 445,
                  y: 399.5,
                },
                {
                  x: 436,
                  y: 443.5,
                },
                {
                  x: 420,
                  y: 468.5,
                },
                {
                  x: 416,
                  y: 497.5,
                },
                {
                  x: 408,
                  y: 547.5,
                },
                {
                  x: 412,
                  y: 594.5,
                },
                {
                  x: 3,
                  y: 596.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8b5f-71a8-8396-eb4f0142f023.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 4,
                  y: 505,
                },
                {
                  x: 28,
                  y: 490,
                },
                {
                  x: 42,
                  y: 476,
                },
                {
                  x: 68,
                  y: 467,
                },
                {
                  x: 102,
                  y: 456,
                },
                {
                  x: 140,
                  y: 435,
                },
                {
                  x: 163,
                  y: 433,
                },
                {
                  x: 178,
                  y: 428,
                },
                {
                  x: 196,
                  y: 428,
                },
                {
                  x: 205,
                  y: 415,
                },
                {
                  x: 221,
                  y: 391,
                },
                {
                  x: 241,
                  y: 373,
                },
                {
                  x: 285,
                  y: 349,
                },
                {
                  x: 323,
                  y: 340,
                },
                {
                  x: 368,
                  y: 335,
                },
                {
                  x: 380,
                  y: 335,
                },
                {
                  x: 375,
                  y: 317,
                },
                {
                  x: 367,
                  y: 296,
                },
                {
                  x: 372,
                  y: 281,
                },
                {
                  x: 371,
                  y: 266,
                },
                {
                  x: 363,
                  y: 252,
                },
                {
                  x: 356,
                  y: 243,
                },
                {
                  x: 333,
                  y: 226,
                },
                {
                  x: 331,
                  y: 208,
                },
                {
                  x: 347,
                  y: 200,
                },
                {
                  x: 368,
                  y: 195,
                },
                {
                  x: 396,
                  y: 195,
                },
                {
                  x: 419,
                  y: 171,
                },
                {
                  x: 448,
                  y: 156,
                },
                {
                  x: 492,
                  y: 149,
                },
                {
                  x: 534,
                  y: 147,
                },
                {
                  x: 578,
                  y: 150,
                },
                {
                  x: 621,
                  y: 156,
                },
                {
                  x: 637,
                  y: 174,
                },
                {
                  x: 645,
                  y: 208,
                },
                {
                  x: 651,
                  y: 249,
                },
                {
                  x: 653,
                  y: 274,
                },
                {
                  x: 648,
                  y: 305,
                },
                {
                  x: 659,
                  y: 331,
                },
                {
                  x: 666,
                  y: 366,
                },
                {
                  x: 666,
                  y: 385,
                },
                {
                  x: 661,
                  y: 411,
                },
                {
                  x: 646,
                  y: 429,
                },
                {
                  x: 633,
                  y: 446,
                },
                {
                  x: 620,
                  y: 467,
                },
                {
                  x: 630,
                  y: 493,
                },
                {
                  x: 647,
                  y: 517,
                },
                {
                  x: 661,
                  y: 531,
                },
                {
                  x: 672,
                  y: 554,
                },
                {
                  x: 674,
                  y: 575,
                },
                {
                  x: 641,
                  y: 578,
                },
                {
                  x: 604,
                  y: 576,
                },
                {
                  x: 603,
                  y: 592,
                },
                {
                  x: 579,
                  y: 604,
                },
                {
                  x: 540,
                  y: 609,
                },
                {
                  x: 501,
                  y: 603,
                },
                {
                  x: 473,
                  y: 590,
                },
                {
                  x: 445,
                  y: 572,
                },
                {
                  x: 424,
                  y: 563,
                },
                {
                  x: 316,
                  y: 556,
                },
                {
                  x: 250,
                  y: 545,
                },
                {
                  x: 176,
                  y: 538,
                },
                {
                  x: 134,
                  y: 536,
                },
                {
                  x: 77,
                  y: 537,
                },
                {
                  x: 31,
                  y: 548,
                },
                {
                  x: 3,
                  y: 546,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 878,
                  y: 601,
                },
                {
                  x: 679,
                  y: 573,
                },
                {
                  x: 673,
                  y: 548,
                },
                {
                  x: 663,
                  y: 526,
                },
                {
                  x: 648,
                  y: 515,
                },
                {
                  x: 634,
                  y: 497,
                },
                {
                  x: 623,
                  y: 467,
                },
                {
                  x: 637,
                  y: 442,
                },
                {
                  x: 658,
                  y: 420,
                },
                {
                  x: 667,
                  y: 399,
                },
                {
                  x: 669,
                  y: 375,
                },
                {
                  x: 669,
                  y: 354,
                },
                {
                  x: 662,
                  y: 326,
                },
                {
                  x: 652,
                  y: 300,
                },
                {
                  x: 658,
                  y: 270,
                },
                {
                  x: 659,
                  y: 258,
                },
                {
                  x: 650,
                  y: 234,
                },
                {
                  x: 647,
                  y: 190,
                },
                {
                  x: 664,
                  y: 162,
                },
                {
                  x: 687,
                  y: 138,
                },
                {
                  x: 725,
                  y: 115,
                },
                {
                  x: 764,
                  y: 103,
                },
                {
                  x: 789,
                  y: 103,
                },
                {
                  x: 815,
                  y: 84,
                },
                {
                  x: 846,
                  y: 77,
                },
                {
                  x: 881,
                  y: 79,
                },
                {
                  x: 922,
                  y: 95,
                },
                {
                  x: 940,
                  y: 112,
                },
                {
                  x: 968,
                  y: 128,
                },
                {
                  x: 988,
                  y: 133,
                },
                {
                  x: 1013,
                  y: 131,
                },
                {
                  x: 1018,
                  y: 143,
                },
                {
                  x: 1041,
                  y: 173,
                },
                {
                  x: 1052,
                  y: 190,
                },
                {
                  x: 1073,
                  y: 213,
                },
                {
                  x: 1077,
                  y: 232,
                },
                {
                  x: 1073,
                  y: 265,
                },
                {
                  x: 1063,
                  y: 279,
                },
                {
                  x: 1051,
                  y: 301,
                },
                {
                  x: 1041,
                  y: 319,
                },
                {
                  x: 1036,
                  y: 332,
                },
                {
                  x: 1026,
                  y: 325,
                },
                {
                  x: 1015,
                  y: 307,
                },
                {
                  x: 1019,
                  y: 331,
                },
                {
                  x: 1034,
                  y: 355,
                },
                {
                  x: 1056,
                  y: 378,
                },
                {
                  x: 1076,
                  y: 401,
                },
                {
                  x: 1097,
                  y: 417,
                },
                {
                  x: 1125,
                  y: 431,
                },
                {
                  x: 1140,
                  y: 436,
                },
                {
                  x: 1154,
                  y: 448,
                },
                {
                  x: 1153,
                  y: 474,
                },
                {
                  x: 1141,
                  y: 490,
                },
                {
                  x: 1107,
                  y: 501,
                },
                {
                  x: 1098,
                  y: 511,
                },
                {
                  x: 1075,
                  y: 524,
                },
                {
                  x: 1041,
                  y: 528,
                },
                {
                  x: 1011,
                  y: 528,
                },
                {
                  x: 1003,
                  y: 530,
                },
                {
                  x: 1006,
                  y: 552,
                },
                {
                  x: 998,
                  y: 575,
                },
                {
                  x: 991,
                  y: 580,
                },
                {
                  x: 977,
                  y: 593,
                },
                {
                  x: 945,
                  y: 606,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8b7d-7758-bc47-57eca4dd844a.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 74,
                  y: 386.5,
                },
                {
                  x: 83,
                  y: 391.5,
                },
                {
                  x: 101,
                  y: 393.5,
                },
                {
                  x: 116,
                  y: 391.5,
                },
                {
                  x: 128,
                  y: 382.5,
                },
                {
                  x: 142,
                  y: 376.5,
                },
                {
                  x: 172,
                  y: 370.5,
                },
                {
                  x: 188,
                  y: 369.5,
                },
                {
                  x: 204,
                  y: 366.5,
                },
                {
                  x: 226,
                  y: 369.5,
                },
                {
                  x: 241,
                  y: 374.5,
                },
                {
                  x: 242,
                  y: 389.5,
                },
                {
                  x: 246,
                  y: 397.5,
                },
                {
                  x: 260,
                  y: 400.5,
                },
                {
                  x: 280,
                  y: 399.5,
                },
                {
                  x: 293,
                  y: 390.5,
                },
                {
                  x: 295,
                  y: 381.5,
                },
                {
                  x: 291,
                  y: 369.5,
                },
                {
                  x: 304,
                  y: 369.5,
                },
                {
                  x: 320,
                  y: 369.5,
                },
                {
                  x: 333,
                  y: 364.5,
                },
                {
                  x: 344,
                  y: 376.5,
                },
                {
                  x: 358,
                  y: 382.5,
                },
                {
                  x: 386,
                  y: 381.5,
                },
                {
                  x: 400,
                  y: 371.5,
                },
                {
                  x: 394,
                  y: 358.5,
                },
                {
                  x: 381,
                  y: 350.5,
                },
                {
                  x: 372,
                  y: 335.5,
                },
                {
                  x: 365,
                  y: 309.5,
                },
                {
                  x: 360,
                  y: 287.5,
                },
                {
                  x: 355,
                  y: 256.5,
                },
                {
                  x: 352,
                  y: 233.5,
                },
                {
                  x: 342,
                  y: 208.5,
                },
                {
                  x: 329,
                  y: 190.5,
                },
                {
                  x: 331,
                  y: 170.5,
                },
                {
                  x: 334,
                  y: 146.5,
                },
                {
                  x: 331,
                  y: 118.5,
                },
                {
                  x: 325,
                  y: 107.5,
                },
                {
                  x: 323,
                  y: 95.5,
                },
                {
                  x: 320,
                  y: 76.5,
                },
                {
                  x: 312,
                  y: 59.5,
                },
                {
                  x: 297,
                  y: 69.5,
                },
                {
                  x: 287,
                  y: 87.5,
                },
                {
                  x: 242,
                  y: 87.5,
                },
                {
                  x: 234,
                  y: 92.5,
                },
                {
                  x: 215,
                  y: 81.5,
                },
                {
                  x: 198,
                  y: 74.5,
                },
                {
                  x: 193,
                  y: 101.5,
                },
                {
                  x: 198,
                  y: 143.5,
                },
                {
                  x: 203,
                  y: 164.5,
                },
                {
                  x: 210,
                  y: 189.5,
                },
                {
                  x: 226,
                  y: 206.5,
                },
                {
                  x: 222,
                  y: 221.5,
                },
                {
                  x: 197,
                  y: 227.5,
                },
                {
                  x: 180,
                  y: 247.5,
                },
                {
                  x: 173,
                  y: 267.5,
                },
                {
                  x: 163,
                  y: 282.5,
                },
                {
                  x: 153,
                  y: 298.5,
                },
                {
                  x: 142,
                  y: 315.5,
                },
                {
                  x: 129,
                  y: 326.5,
                },
                {
                  x: 121,
                  y: 329.5,
                },
                {
                  x: 107,
                  y: 329.5,
                },
                {
                  x: 75,
                  y: 327.5,
                },
                {
                  x: 64,
                  y: 328.5,
                },
                {
                  x: 36,
                  y: 335.5,
                },
                {
                  x: 13,
                  y: 344.5,
                },
                {
                  x: 5,
                  y: 353.5,
                },
                {
                  x: 11,
                  y: 360.5,
                },
                {
                  x: 45,
                  y: 362.5,
                },
                {
                  x: 65,
                  y: 360.5,
                },
                {
                  x: 91,
                  y: 359.5,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 401,
                  y: 376.5,
                },
                {
                  x: 420,
                  y: 378.5,
                },
                {
                  x: 446,
                  y: 376.5,
                },
                {
                  x: 470,
                  y: 371.5,
                },
                {
                  x: 469,
                  y: 356.5,
                },
                {
                  x: 456,
                  y: 344.5,
                },
                {
                  x: 449,
                  y: 328.5,
                },
                {
                  x: 465,
                  y: 332.5,
                },
                {
                  x: 484,
                  y: 344.5,
                },
                {
                  x: 508,
                  y: 351.5,
                },
                {
                  x: 527,
                  y: 358.5,
                },
                {
                  x: 559,
                  y: 357.5,
                },
                {
                  x: 582,
                  y: 352.5,
                },
                {
                  x: 590,
                  y: 344.5,
                },
                {
                  x: 588,
                  y: 334.5,
                },
                {
                  x: 576,
                  y: 328.5,
                },
                {
                  x: 563,
                  y: 323.5,
                },
                {
                  x: 537,
                  y: 321.5,
                },
                {
                  x: 525,
                  y: 309.5,
                },
                {
                  x: 519,
                  y: 292.5,
                },
                {
                  x: 509,
                  y: 289.5,
                },
                {
                  x: 504,
                  y: 273.5,
                },
                {
                  x: 506,
                  y: 265.5,
                },
                {
                  x: 526,
                  y: 265.5,
                },
                {
                  x: 538,
                  y: 251.5,
                },
                {
                  x: 544,
                  y: 244.5,
                },
                {
                  x: 540,
                  y: 229.5,
                },
                {
                  x: 555,
                  y: 203.5,
                },
                {
                  x: 561,
                  y: 189.5,
                },
                {
                  x: 564,
                  y: 175.5,
                },
                {
                  x: 557,
                  y: 159.5,
                },
                {
                  x: 548,
                  y: 142.5,
                },
                {
                  x: 542,
                  y: 129.5,
                },
                {
                  x: 536,
                  y: 103.5,
                },
                {
                  x: 527,
                  y: 79.5,
                },
                {
                  x: 515,
                  y: 72.5,
                },
                {
                  x: 496,
                  y: 56.5,
                },
                {
                  x: 467,
                  y: 41.5,
                },
                {
                  x: 446,
                  y: 38.5,
                },
                {
                  x: 409,
                  y: 41.5,
                },
                {
                  x: 369,
                  y: 52.5,
                },
                {
                  x: 350,
                  y: 64.5,
                },
                {
                  x: 331,
                  y: 81.5,
                },
                {
                  x: 327,
                  y: 99.5,
                },
                {
                  x: 332,
                  y: 123.5,
                },
                {
                  x: 336,
                  y: 141.5,
                },
                {
                  x: 336,
                  y: 156.5,
                },
                {
                  x: 331,
                  y: 182.5,
                },
                {
                  x: 331,
                  y: 194.5,
                },
                {
                  x: 338,
                  y: 204.5,
                },
                {
                  x: 352,
                  y: 230.5,
                },
                {
                  x: 358,
                  y: 260.5,
                },
                {
                  x: 361,
                  y: 285.5,
                },
                {
                  x: 366,
                  y: 309.5,
                },
                {
                  x: 372,
                  y: 337.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8b9d-76d9-be7b-bb27a33e796d.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 3,
                  y: 657,
                },
                {
                  x: 41,
                  y: 658,
                },
                {
                  x: 93,
                  y: 661,
                },
                {
                  x: 134,
                  y: 664,
                },
                {
                  x: 177,
                  y: 666,
                },
                {
                  x: 204,
                  y: 669,
                },
                {
                  x: 222,
                  y: 677,
                },
                {
                  x: 233,
                  y: 695,
                },
                {
                  x: 252,
                  y: 718,
                },
                {
                  x: 272,
                  y: 723,
                },
                {
                  x: 299,
                  y: 725,
                },
                {
                  x: 319,
                  y: 720,
                },
                {
                  x: 327,
                  y: 713,
                },
                {
                  x: 324,
                  y: 698,
                },
                {
                  x: 321,
                  y: 688,
                },
                {
                  x: 340,
                  y: 683,
                },
                {
                  x: 376,
                  y: 681,
                },
                {
                  x: 412,
                  y: 678,
                },
                {
                  x: 443,
                  y: 683,
                },
                {
                  x: 466,
                  y: 692,
                },
                {
                  x: 483,
                  y: 701,
                },
                {
                  x: 513,
                  y: 707,
                },
                {
                  x: 544,
                  y: 709,
                },
                {
                  x: 555,
                  y: 696,
                },
                {
                  x: 549,
                  y: 682,
                },
                {
                  x: 527,
                  y: 669,
                },
                {
                  x: 519,
                  y: 663,
                },
                {
                  x: 509,
                  y: 638,
                },
                {
                  x: 497,
                  y: 620,
                },
                {
                  x: 484,
                  y: 602,
                },
                {
                  x: 475,
                  y: 573,
                },
                {
                  x: 471,
                  y: 543,
                },
                {
                  x: 471,
                  y: 509,
                },
                {
                  x: 465,
                  y: 494,
                },
                {
                  x: 458,
                  y: 480,
                },
                {
                  x: 446,
                  y: 464,
                },
                {
                  x: 440,
                  y: 443,
                },
                {
                  x: 436,
                  y: 424,
                },
                {
                  x: 434,
                  y: 399,
                },
                {
                  x: 433,
                  y: 369,
                },
                {
                  x: 437,
                  y: 349,
                },
                {
                  x: 436,
                  y: 327,
                },
                {
                  x: 425,
                  y: 324,
                },
                {
                  x: 413,
                  y: 330,
                },
                {
                  x: 395,
                  y: 352,
                },
                {
                  x: 378,
                  y: 362,
                },
                {
                  x: 364,
                  y: 362,
                },
                {
                  x: 344,
                  y: 361,
                },
                {
                  x: 326,
                  y: 357,
                },
                {
                  x: 310,
                  y: 342,
                },
                {
                  x: 295,
                  y: 331,
                },
                {
                  x: 282,
                  y: 326,
                },
                {
                  x: 271,
                  y: 325,
                },
                {
                  x: 267,
                  y: 343,
                },
                {
                  x: 269,
                  y: 361,
                },
                {
                  x: 272,
                  y: 393,
                },
                {
                  x: 271,
                  y: 410,
                },
                {
                  x: 264,
                  y: 443,
                },
                {
                  x: 235,
                  y: 449,
                },
                {
                  x: 207,
                  y: 450,
                },
                {
                  x: 183,
                  y: 453,
                },
                {
                  x: 137,
                  y: 456,
                },
                {
                  x: 113,
                  y: 464,
                },
                {
                  x: 80,
                  y: 475,
                },
                {
                  x: 60,
                  y: 490,
                },
                {
                  x: 30,
                  y: 502,
                },
                {
                  x: 3,
                  y: 501,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 559,
                  y: 689,
                },
                {
                  x: 591,
                  y: 695,
                },
                {
                  x: 609,
                  y: 711,
                },
                {
                  x: 638,
                  y: 718,
                },
                {
                  x: 677,
                  y: 717,
                },
                {
                  x: 694,
                  y: 713,
                },
                {
                  x: 707,
                  y: 696,
                },
                {
                  x: 697,
                  y: 674,
                },
                {
                  x: 682,
                  y: 664,
                },
                {
                  x: 627,
                  y: 649,
                },
                {
                  x: 620,
                  y: 637,
                },
                {
                  x: 595,
                  y: 618,
                },
                {
                  x: 605,
                  y: 609,
                },
                {
                  x: 625,
                  y: 616,
                },
                {
                  x: 666,
                  y: 631,
                },
                {
                  x: 730,
                  y: 643,
                },
                {
                  x: 767,
                  y: 652,
                },
                {
                  x: 792,
                  y: 661,
                },
                {
                  x: 796,
                  y: 603,
                },
                {
                  x: 779,
                  y: 581,
                },
                {
                  x: 762,
                  y: 568,
                },
                {
                  x: 737,
                  y: 557,
                },
                {
                  x: 718,
                  y: 543,
                },
                {
                  x: 719,
                  y: 501,
                },
                {
                  x: 727,
                  y: 465,
                },
                {
                  x: 727,
                  y: 431,
                },
                {
                  x: 722,
                  y: 404,
                },
                {
                  x: 708,
                  y: 375,
                },
                {
                  x: 730,
                  y: 282,
                },
                {
                  x: 741,
                  y: 307,
                },
                {
                  x: 765,
                  y: 320,
                },
                {
                  x: 781,
                  y: 314,
                },
                {
                  x: 791,
                  y: 289,
                },
                {
                  x: 796,
                  y: 260,
                },
                {
                  x: 780,
                  y: 215,
                },
                {
                  x: 757,
                  y: 191,
                },
                {
                  x: 727,
                  y: 169,
                },
                {
                  x: 686,
                  y: 153,
                },
                {
                  x: 643,
                  y: 139,
                },
                {
                  x: 619,
                  y: 144,
                },
                {
                  x: 575,
                  y: 156,
                },
                {
                  x: 542,
                  y: 167,
                },
                {
                  x: 498,
                  y: 202,
                },
                {
                  x: 481,
                  y: 230,
                },
                {
                  x: 486,
                  y: 267,
                },
                {
                  x: 493,
                  y: 292,
                },
                {
                  x: 514,
                  y: 308,
                },
                {
                  x: 537,
                  y: 298,
                },
                {
                  x: 538,
                  y: 315,
                },
                {
                  x: 524,
                  y: 334,
                },
                {
                  x: 498,
                  y: 348,
                },
                {
                  x: 453,
                  y: 365,
                },
                {
                  x: 440,
                  y: 368,
                },
                {
                  x: 434,
                  y: 384,
                },
                {
                  x: 439,
                  y: 418,
                },
                {
                  x: 442,
                  y: 436,
                },
                {
                  x: 444,
                  y: 453,
                },
                {
                  x: 453,
                  y: 470,
                },
                {
                  x: 462,
                  y: 486,
                },
                {
                  x: 474,
                  y: 520,
                },
                {
                  x: 475,
                  y: 556,
                },
                {
                  x: 481,
                  y: 583,
                },
                {
                  x: 498,
                  y: 614,
                },
                {
                  x: 513,
                  y: 638,
                },
                {
                  x: 520,
                  y: 658,
                },
                {
                  x: 533,
                  y: 668,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8be7-73a9-a5a7-b5f3d43bf926.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 302,
                  y: 667,
                },
                {
                  x: 289,
                  y: 606,
                },
                {
                  x: 279,
                  y: 564,
                },
                {
                  x: 273,
                  y: 476,
                },
                {
                  x: 267,
                  y: 444,
                },
                {
                  x: 284,
                  y: 401,
                },
                {
                  x: 279,
                  y: 370,
                },
                {
                  x: 263,
                  y: 326,
                },
                {
                  x: 260,
                  y: 297,
                },
                {
                  x: 250,
                  y: 278,
                },
                {
                  x: 241,
                  y: 291,
                },
                {
                  x: 227,
                  y: 266,
                },
                {
                  x: 203,
                  y: 257,
                },
                {
                  x: 163,
                  y: 228,
                },
                {
                  x: 151,
                  y: 207,
                },
                {
                  x: 165,
                  y: 168,
                },
                {
                  x: 176,
                  y: 138,
                },
                {
                  x: 200,
                  y: 114,
                },
                {
                  x: 225,
                  y: 89,
                },
                {
                  x: 244,
                  y: 74,
                },
                {
                  x: 255,
                  y: 64,
                },
                {
                  x: 269,
                  y: 69,
                },
                {
                  x: 315,
                  y: 51,
                },
                {
                  x: 356,
                  y: 48,
                },
                {
                  x: 387,
                  y: 43,
                },
                {
                  x: 427,
                  y: 44,
                },
                {
                  x: 446,
                  y: 56,
                },
                {
                  x: 473,
                  y: 54,
                },
                {
                  x: 489,
                  y: 60,
                },
                {
                  x: 510,
                  y: 80,
                },
                {
                  x: 536,
                  y: 97,
                },
                {
                  x: 562,
                  y: 119,
                },
                {
                  x: 579,
                  y: 139,
                },
                {
                  x: 585,
                  y: 160,
                },
                {
                  x: 580,
                  y: 181,
                },
                {
                  x: 567,
                  y: 202,
                },
                {
                  x: 551,
                  y: 217,
                },
                {
                  x: 535,
                  y: 231,
                },
                {
                  x: 534,
                  y: 244,
                },
                {
                  x: 537,
                  y: 262,
                },
                {
                  x: 523,
                  y: 256,
                },
                {
                  x: 512,
                  y: 265,
                },
                {
                  x: 518,
                  y: 304,
                },
                {
                  x: 535,
                  y: 333,
                },
                {
                  x: 564,
                  y: 355,
                },
                {
                  x: 580,
                  y: 376,
                },
                {
                  x: 593,
                  y: 396,
                },
                {
                  x: 621,
                  y: 406,
                },
                {
                  x: 655,
                  y: 418,
                },
                {
                  x: 685,
                  y: 441,
                },
                {
                  x: 711,
                  y: 461,
                },
                {
                  x: 732,
                  y: 483,
                },
                {
                  x: 742,
                  y: 520,
                },
                {
                  x: 753,
                  y: 552,
                },
                {
                  x: 772,
                  y: 565,
                },
                {
                  x: 788,
                  y: 584,
                },
                {
                  x: 802,
                  y: 611,
                },
                {
                  x: 808,
                  y: 643,
                },
                {
                  x: 810,
                  y: 671,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8c13-722e-8fa8-7b4b4fd0ab49.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 341,
                  y: 301.5,
                },
                {
                  x: 341,
                  y: 278.5,
                },
                {
                  x: 323,
                  y: 276.5,
                },
                {
                  x: 315,
                  y: 260.5,
                },
                {
                  x: 309,
                  y: 239.5,
                },
                {
                  x: 312,
                  y: 217.5,
                },
                {
                  x: 316,
                  y: 177.5,
                },
                {
                  x: 316,
                  y: 159.5,
                },
                {
                  x: 296,
                  y: 136.5,
                },
                {
                  x: 264,
                  y: 118.5,
                },
                {
                  x: 236,
                  y: 97.5,
                },
                {
                  x: 235,
                  y: 86.5,
                },
                {
                  x: 245,
                  y: 78.5,
                },
                {
                  x: 272,
                  y: 82.5,
                },
                {
                  x: 300,
                  y: 93.5,
                },
                {
                  x: 305,
                  y: 79.5,
                },
                {
                  x: 306,
                  y: 65.5,
                },
                {
                  x: 325,
                  y: 51.5,
                },
                {
                  x: 340,
                  y: 52.5,
                },
                {
                  x: 346,
                  y: 67.5,
                },
                {
                  x: 377,
                  y: 64.5,
                },
                {
                  x: 404,
                  y: 66.5,
                },
                {
                  x: 420,
                  y: 63.5,
                },
                {
                  x: 431,
                  y: 55.5,
                },
                {
                  x: 447,
                  y: 63.5,
                },
                {
                  x: 445,
                  y: 88.5,
                },
                {
                  x: 434,
                  y: 96.5,
                },
                {
                  x: 424,
                  y: 100.5,
                },
                {
                  x: 438,
                  y: 124.5,
                },
                {
                  x: 450,
                  y: 153.5,
                },
                {
                  x: 460,
                  y: 181.5,
                },
                {
                  x: 462,
                  y: 205.5,
                },
                {
                  x: 451,
                  y: 235.5,
                },
                {
                  x: 440,
                  y: 260.5,
                },
                {
                  x: 425,
                  y: 281.5,
                },
                {
                  x: 417,
                  y: 300.5,
                },
                {
                  x: 402,
                  y: 315.5,
                },
                {
                  x: 391,
                  y: 302.5,
                },
                {
                  x: 370,
                  y: 299.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8c3c-703b-bff3-00b0c1dc274f.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 946.2686567164178,
                  y: 1004.136225002915,
                },
                {
                  x: 926.865671641791,
                  y: 929.5093593312732,
                },
                {
                  x: 913.4328358208954,
                  y: 865.3302548536614,
                },
                {
                  x: 913.4328358208954,
                  y: 826.5242847044076,
                },
                {
                  x: 905.9701492537313,
                  y: 777.270553361124,
                },
                {
                  x: 900,
                  y: 745.9272697790344,
                },
                {
                  x: 846.2686567164178,
                  y: 735.4795085850046,
                },
                {
                  x: 794.0298507462686,
                  y: 720.5541354506763,
                },
                {
                  x: 747.7611940298507,
                  y: 717.5690608238106,
                },
                {
                  x: 679.1044776119403,
                  y: 713.091448883512,
                },
                {
                  x: 629.8507462686567,
                  y: 708.6138369432135,
                },
                {
                  x: 623.8805970149253,
                  y: 735.4795085850046,
                },
                {
                  x: 614.9253731343283,
                  y: 741.449657838736,
                },
                {
                  x: 592.5373134328357,
                  y: 747.4198070924673,
                },
                {
                  x: 573.1343283582089,
                  y: 753.3899563461987,
                },
                {
                  x: 559.7014925373134,
                  y: 793.6884638088852,
                },
                {
                  x: 547.7611940298507,
                  y: 814.5839861969449,
                },
                {
                  x: 517.910447761194,
                  y: 845.9272697790344,
                },
                {
                  x: 486.56716417910445,
                  y: 869.8078667939599,
                },
                {
                  x: 450.7462686567164,
                  y: 896.6735384357509,
                },
                {
                  x: 428.35820895522386,
                  y: 932.494433958139,
                },
                {
                  x: 414.9253731343283,
                  y: 956.3750309730643,
                },
                {
                  x: 408.955223880597,
                  y: 968.315329480527,
                },
                {
                  x: 380.5970149253731,
                  y: 974.2854787342584,
                },
                {
                  x: 356.7164179104477,
                  y: 972.7929414208255,
                },
                {
                  x: 331.34328358208955,
                  y: 951.8974190327658,
                },
                {
                  x: 317.910447761194,
                  y: 941.4496578387359,
                },
                {
                  x: 320.8955223880597,
                  y: 919.0615981372434,
                },
                {
                  x: 350.7462686567164,
                  y: 899.6586130626165,
                },
                {
                  x: 368.65671641791045,
                  y: 868.315329480527,
                },
                {
                  x: 356.7164179104477,
                  y: 874.2854787342584,
                },
                {
                  x: 317.910447761194,
                  y: 890.7033891820196,
                },
                {
                  x: 300,
                  y: 911.5989115700793,
                },
                {
                  x: 282.08955223880594,
                  y: 936.9720458984375,
                },
                {
                  x: 264.17910447761193,
                  y: 957.8675682864971,
                },
                {
                  x: 237.3134328358209,
                  y: 957.8675682864971,
                },
                {
                  x: 211.94029850746267,
                  y: 947.4198070924673,
                },
                {
                  x: 189.55223880597015,
                  y: 933.9869712715717,
                },
                {
                  x: 158.2089552238806,
                  y: 914.5839861969449,
                },
                {
                  x: 135.82089552238804,
                  y: 901.1511503760494,
                },
                {
                  x: 149.25373134328356,
                  y: 871.3004041073926,
                },
                {
                  x: 171.6417910447761,
                  y: 822.0466727641091,
                },
                {
                  x: 202.98507462686567,
                  y: 778.7630906745569,
                },
                {
                  x: 223.88059701492537,
                  y: 725.0317473909747,
                },
                {
                  x: 243.28358208955223,
                  y: 672.7929414208255,
                },
                {
                  x: 256.7164179104478,
                  y: 620.5541354506763,
                },
                {
                  x: 264.17910447761193,
                  y: 575.7780160476912,
                },
                {
                  x: 280.5970149253731,
                  y: 526.5242847044076,
                },
                {
                  x: 295.5223880597015,
                  y: 496.6735384357509,
                },
                {
                  x: 313.4328358208955,
                  y: 484.73323992828824,
                },
                {
                  x: 362.6865671641791,
                  y: 460.85264291336284,
                },
                {
                  x: 416.4179104477612,
                  y: 413.0914488835121,
                },
                {
                  x: 476.1194029850746,
                  y: 381.74816530142255,
                },
                {
                  x: 546.2686567164179,
                  y: 362.34518022679566,
                },
                {
                  x: 613.4328358208954,
                  y: 351.8974190327658,
                },
                {
                  x: 682.0895522388059,
                  y: 342.94219515216884,
                },
                {
                  x: 752.2388059701492,
                  y: 339.95712052530314,
                },
                {
                  x: 819.4029850746268,
                  y: 341.44965783873596,
                },
                {
                  x: 907.4626865671642,
                  y: 333.9869712715718,
                },
                {
                  x: 979.1044776119403,
                  y: 322.04667276410913,
                },
                {
                  x: 1005.9701492537313,
                  y: 301.15115037604943,
                },
                {
                  x: 1052.238805970149,
                  y: 292.1959264954524,
                },
                {
                  x: 1082.089552238806,
                  y: 257.8675682864972,
                },
                {
                  x: 1086.5671641791043,
                  y: 233.9869712715718,
                },
                {
                  x: 1080.597014925373,
                  y: 216.0765235103778,
                },
                {
                  x: 1079.1044776119402,
                  y: 199.65861306261658,
                },
                {
                  x: 1092.5373134328358,
                  y: 177.27055336112406,
                },
                {
                  x: 1092.5373134328358,
                  y: 147.41980709246735,
                },
                {
                  x: 1091.044776119403,
                  y: 119.06159813724346,
                },
                {
                  x: 1100,
                  y: 89.21085186858674,
                },
                {
                  x: 1116.4179104477612,
                  y: 65.33025485366137,
                },
                {
                  x: 1137.3134328358208,
                  y: 74.28547873425839,
                },
                {
                  x: 1147.7611940298507,
                  y: 111.59891157007928,
                },
                {
                  x: 1165.6716417910447,
                  y: 145.9272697790345,
                },
                {
                  x: 1179.1044776119402,
                  y: 184.73323992828824,
                },
                {
                  x: 1207.4626865671642,
                  y: 181.74816530142257,
                },
                {
                  x: 1241.7910447761194,
                  y: 186.22577724172106,
                },
                {
                  x: 1252.238805970149,
                  y: 142.94219515216884,
                },
                {
                  x: 1271.641791044776,
                  y: 122.04667276410913,
                },
                {
                  x: 1305.9701492537313,
                  y: 90.70338918201958,
                },
                {
                  x: 1325.3731343283582,
                  y: 86.22577724172108,
                },
                {
                  x: 1334.3283582089553,
                  y: 119.06159813724346,
                },
                {
                  x: 1337.3134328358208,
                  y: 162.3451802267957,
                },
                {
                  x: 1332.8358208955224,
                  y: 213.0914488835121,
                },
                {
                  x: 1329.8507462686566,
                  y: 239.95712052530317,
                },
                {
                  x: 1316.4179104477612,
                  y: 253.3899563461987,
                },
                {
                  x: 1313.4328358208954,
                  y: 269.8078667939599,
                },
                {
                  x: 1307.4626865671642,
                  y: 287.7183145551539,
                },
                {
                  x: 1307.4626865671642,
                  y: 314.5839861969449,
                },
                {
                  x: 1308.955223880597,
                  y: 344.43473246560166,
                },
                {
                  x: 1305.9701492537313,
                  y: 374.2854787342584,
                },
                {
                  x: 1295.5223880597014,
                  y: 399.65861306261655,
                },
                {
                  x: 1271.641791044776,
                  y: 439.95712052530314,
                },
                {
                  x: 1256.7164179104477,
                  y: 477.27055336112403,
                },
                {
                  x: 1234.3283582089553,
                  y: 526.5242847044076,
                },
                {
                  x: 1210.4477611940297,
                  y: 554.8824936596315,
                },
                {
                  x: 1194.0298507462685,
                  y: 569.8078667939599,
                },
                {
                  x: 1177.6119402985073,
                  y: 625.0317473909748,
                },
                {
                  x: 1162.686567164179,
                  y: 677.270553361124,
                },
                {
                  x: 1138.8059701492537,
                  y: 707.1212996297808,
                },
                {
                  x: 1116.4179104477612,
                  y: 725.0317473909747,
                },
                {
                  x: 1101.4925373134329,
                  y: 745.9272697790344,
                },
                {
                  x: 1091.044776119403,
                  y: 774.2854787342584,
                },
                {
                  x: 1079.1044776119402,
                  y: 802.6436876894822,
                },
                {
                  x: 1068.6567164179103,
                  y: 841.4496578387359,
                },
                {
                  x: 1065.6716417910447,
                  y: 895.1810011223181,
                },
                {
                  x: 1062.686567164179,
                  y: 951.8974190327658,
                },
                {
                  x: 1053.731343283582,
                  y: 983.2407026148553,
                },
                {
                  x: 1020.8955223880596,
                  y: 983.2407026148553,
                },
                {
                  x: 1007.4626865671642,
                  y: 998.1660757491837,
                },
                {
                  x: 980.5970149253731,
                  y: 990.7033891820196,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8c83-72cb-b2e3-c251ba170dfa.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 742.9759098933293,
                  y: 1189.0781109149639,
                },
                {
                  x: 727.5912945087139,
                  y: 1144.8473416841946,
                },
                {
                  x: 717.9759098933293,
                  y: 1085.23195706881,
                },
                {
                  x: 692.9759098933293,
                  y: 994.8473416841947,
                },
                {
                  x: 683.3605252779447,
                  y: 933.3088801457332,
                },
                {
                  x: 677.5912945087139,
                  y: 891.0011878380409,
                },
                {
                  x: 658.3605252779447,
                  y: 883.3088801457332,
                },
                {
                  x: 631.4374483548678,
                  y: 891.0011878380409,
                },
                {
                  x: 560.2836022010216,
                  y: 898.6934955303485,
                },
                {
                  x: 571.8220637394832,
                  y: 850.6165724534254,
                },
                {
                  x: 585.2836022010216,
                  y: 810.2319570688101,
                },
                {
                  x: 575.668217585637,
                  y: 741.0011878380409,
                },
                {
                  x: 533.3605252779447,
                  y: 766.0011878380409,
                },
                {
                  x: 479.51437143179083,
                  y: 758.3088801457332,
                },
                {
                  x: 464.1297560471755,
                  y: 696.7704186072716,
                },
                {
                  x: 483.3605252779447,
                  y: 669.8473416841947,
                },
                {
                  x: 539.1297560471754,
                  y: 637.155033991887,
                },
                {
                  x: 569.8989868164062,
                  y: 621.7704186072716,
                },
                {
                  x: 602.5912945087139,
                  y: 612.155033991887,
                },
                {
                  x: 619.8989868164062,
                  y: 573.6934955303485,
                },
                {
                  x: 642.9759098933293,
                  y: 539.0781109149639,
                },
                {
                  x: 650.668217585637,
                  y: 500.6165724534255,
                },
                {
                  x: 648.7451406625601,
                  y: 439.07811091496393,
                },
                {
                  x: 658.3605252779447,
                  y: 412.155033991887,
                },
                {
                  x: 656.4374483548678,
                  y: 373.69349553034857,
                },
                {
                  x: 673.7451406625601,
                  y: 339.07811091496393,
                },
                {
                  x: 700.668217585637,
                  y: 306.38580322265625,
                },
                {
                  x: 704.5143714317909,
                  y: 256.38580322265625,
                },
                {
                  x: 746.8220637394832,
                  y: 212.15503399188702,
                },
                {
                  x: 764.1297560471754,
                  y: 181.38580322265625,
                },
                {
                  x: 798.7451406625601,
                  y: 131.38580322265625,
                },
                {
                  x: 879.5143714317909,
                  y: 117.92426476111778,
                },
                {
                  x: 942.9759098933293,
                  y: 154.46272629957932,
                },
                {
                  x: 962.2066791240985,
                  y: 162.15503399188702,
                },
                {
                  x: 1016.0528329702523,
                  y: 135.2319570688101,
                },
                {
                  x: 1091.0528329702524,
                  y: 129.46272629957932,
                },
                {
                  x: 1141.0528329702524,
                  y: 119.8473416841947,
                },
                {
                  x: 1239.1297560471755,
                  y: 123.69349553034856,
                },
                {
                  x: 1275.668217585637,
                  y: 148.69349553034854,
                },
                {
                  x: 1304.5143714317908,
                  y: 198.69349553034854,
                },
                {
                  x: 1364.1297560471755,
                  y: 248.69349553034854,
                },
                {
                  x: 1416.0528329702524,
                  y: 291.00118783804083,
                },
                {
                  x: 1433.3605252779446,
                  y: 342.9242647611178,
                },
                {
                  x: 1439.1297560471755,
                  y: 383.30888014573316,
                },
                {
                  x: 1441.0528329702524,
                  y: 471.7704186072716,
                },
                {
                  x: 1456.4374483548677,
                  y: 560.2319570688101,
                },
                {
                  x: 1469.8989868164062,
                  y: 633.3088801457332,
                },
                {
                  x: 1469.8989868164062,
                  y: 714.0781109149639,
                },
                {
                  x: 1462.2066791240984,
                  y: 775.6165724534254,
                },
                {
                  x: 1431.4374483548677,
                  y: 808.3088801457332,
                },
                {
                  x: 1414.1297560471755,
                  y: 844.8473416841947,
                },
                {
                  x: 1400.668217585637,
                  y: 873.6934955303485,
                },
                {
                  x: 1394.8989868164062,
                  y: 921.7704186072716,
                },
                {
                  x: 1410.2836022010215,
                  y: 983.3088801457332,
                },
                {
                  x: 1427.5912945087139,
                  y: 1037.155033991887,
                },
                {
                  x: 1431.4374483548677,
                  y: 1083.3088801457332,
                },
                {
                  x: 1396.8220637394832,
                  y: 1108.3088801457332,
                },
                {
                  x: 1348.74514066256,
                  y: 1112.155033991887,
                },
                {
                  x: 1287.2066791240984,
                  y: 1096.7704186072715,
                },
                {
                  x: 1254.5143714317908,
                  y: 1071.7704186072715,
                },
                {
                  x: 1217.9759098933293,
                  y: 1031.3858032226562,
                },
                {
                  x: 1181.4374483548677,
                  y: 981.3858032226562,
                },
                {
                  x: 1137.2066791240986,
                  y: 975.6165724534254,
                },
                {
                  x: 1123.74514066256,
                  y: 1019.8473416841947,
                },
                {
                  x: 1083.3605252779446,
                  y: 1035.23195706881,
                },
                {
                  x: 1052.5912945087139,
                  y: 1031.3858032226562,
                },
                {
                  x: 1041.0528329702524,
                  y: 1031.3858032226562,
                },
                {
                  x: 996.8220637394832,
                  y: 1058.3088801457332,
                },
                {
                  x: 975.668217585637,
                  y: 1046.7704186072715,
                },
                {
                  x: 956.4374483548678,
                  y: 1077.5396493765024,
                },
                {
                  x: 954.5143714317908,
                  y: 1121.7704186072715,
                },
                {
                  x: 952.5912945087139,
                  y: 1160.23195706881,
                },
                {
                  x: 910.2836022010216,
                  y: 1179.4627262995793,
                },
                {
                  x: 875.668217585637,
                  y: 1194.8473416841946,
                },
                {
                  x: 833.3605252779447,
                  y: 1206.3858032226562,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8cd3-7718-ba7e-0f493b430769.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 96.4381267115013,
                  y: 387.5866604834488,
                },
                {
                  x: 100.0463741341817,
                  y: 372.6382068752014,
                },
                {
                  x: 109.32472464964562,
                  y: 367.9990316174694,
                },
                {
                  x: 104.17008547438789,
                  y: 347.89593883396424,
                },
                {
                  x: 106.23194114449099,
                  y: 328.82377388551066,
                },
                {
                  x: 119.63400300016109,
                  y: 316.4526398648921,
                },
                {
                  x: 122.21132258778995,
                  y: 290.1639800710777,
                },
                {
                  x: 122.72678650531573,
                  y: 264.90624811231476,
                },
                {
                  x: 121.69585867026417,
                  y: 229.3392378030364,
                },
                {
                  x: 121.69585867026417,
                  y: 200.4732584215931,
                },
                {
                  x: 127.88142568057346,
                  y: 164.39078419478898,
                },
                {
                  x: 134.06699269088273,
                  y: 149.44233058654157,
                },
                {
                  x: 154.1700854743879,
                  y: 124.70006254530445,
                },
                {
                  x: 156.23194114449097,
                  y: 103.05057800922198,
                },
                {
                  x: 158.2937968145941,
                  y: 86.55573264839722,
                },
                {
                  x: 159.8401885671714,
                  y: 65.9371759473663,
                },
                {
                  x: 159.32472464964562,
                  y: 43.77222749375805,
                },
                {
                  x: 144.3762710413982,
                  y: 32.94748522571682,
                },
                {
                  x: 133.55152877335695,
                  y: 33.46294914324259,
                },
                {
                  x: 148.49998238160438,
                  y: 12.328928524685889,
                },
                {
                  x: 183.0360648558312,
                  y: 12.844392442211662,
                },
                {
                  x: 201.59276588675903,
                  y: 28.823773885510633,
                },
                {
                  x: 219.11853908263532,
                  y: 36.04026873087146,
                },
                {
                  x: 230.45874526820234,
                  y: 31.91655739066527,
                },
                {
                  x: 253.13915763933636,
                  y: 18.514495534995167,
                },
                {
                  x: 286.6443122785116,
                  y: 30.885629555613725,
                },
                {
                  x: 293.3453432063467,
                  y: 56.658825431902386,
                },
                {
                  x: 269.1185390826353,
                  y: 51.50418625664465,
                },
                {
                  x: 267.0566834125322,
                  y: 73.15367079272713,
                },
                {
                  x: 263.4484359898518,
                  y: 94.28769141128383,
                },
                {
                  x: 261.9020442372745,
                  y: 116.45263986489208,
                },
                {
                  x: 253.6546215568621,
                  y: 134.49387697829414,
                },
                {
                  x: 241.79895145376935,
                  y: 150.98872233911888,
                },
                {
                  x: 237.67524011356315,
                  y: 160.78253677210859,
                },
                {
                  x: 241.28348753624357,
                  y: 174.18459862777868,
                },
                {
                  x: 245.40719887644974,
                  y: 198.9268666690158,
                },
                {
                  x: 256.74740506201675,
                  y: 210.78253677210859,
                },
                {
                  x: 254.1700854743879,
                  y: 229.3392378030364,
                },
                {
                  x: 251.59276588675903,
                  y: 244.28769141128384,
                },
                {
                  x: 262.41750815480026,
                  y: 267.9990316174694,
                },
                {
                  x: 274.27317825789305,
                  y: 289.1330522360261,
                },
                {
                  x: 277.88142568057344,
                  y: 299.95779450406735,
                },
                {
                  x: 284.5824566084085,
                  y: 325.730990380356,
                },
                {
                  x: 286.12884836098584,
                  y: 347.38047491643846,
                },
                {
                  x: 288.1907040310889,
                  y: 368.5144955349952,
                },
                {
                  x: 287.6752401135632,
                  y: 379.85470172056216,
                },
                {
                  x: 266.02575557748065,
                  y: 388.10212440097456,
                },
                {
                  x: 224.27317825789305,
                  y: 391.71037182365495,
                },
                {
                  x: 197.9845184640786,
                  y: 392.7412996587065,
                },
                {
                  x: 180.45874526820234,
                  y: 390.1639800710777,
                },
                {
                  x: 169.6340030001611,
                  y: 388.61758831850034,
                },
                {
                  x: 148.49998238160438,
                  y: 388.61758831850034,
                },
                {
                  x: 127.36596176304768,
                  y: 390.67944398860345,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8cfe-700e-bf0d-e20d5907e63f.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 4,
                  y: 152.5,
                },
                {
                  x: 58,
                  y: 135.5,
                },
                {
                  x: 123,
                  y: 130.5,
                },
                {
                  x: 180,
                  y: 126.5,
                },
                {
                  x: 241,
                  y: 127.5,
                },
                {
                  x: 303,
                  y: 124.5,
                },
                {
                  x: 308,
                  y: 103.5,
                },
                {
                  x: 302,
                  y: 64.5,
                },
                {
                  x: 305,
                  y: 40.5,
                },
                {
                  x: 309,
                  y: 23.5,
                },
                {
                  x: 327,
                  y: 24.5,
                },
                {
                  x: 343,
                  y: 39.5,
                },
                {
                  x: 359,
                  y: 70.5,
                },
                {
                  x: 368,
                  y: 84.5,
                },
                {
                  x: 380,
                  y: 103.5,
                },
                {
                  x: 391,
                  y: 114.5,
                },
                {
                  x: 422,
                  y: 116.5,
                },
                {
                  x: 455,
                  y: 120.5,
                },
                {
                  x: 487,
                  y: 129.5,
                },
                {
                  x: 528,
                  y: 140.5,
                },
                {
                  x: 551,
                  y: 152.5,
                },
                {
                  x: 574,
                  y: 160.5,
                },
                {
                  x: 616,
                  y: 168.5,
                },
                {
                  x: 643,
                  y: 178.5,
                },
                {
                  x: 672,
                  y: 186.5,
                },
                {
                  x: 709,
                  y: 198.5,
                },
                {
                  x: 737,
                  y: 214.5,
                },
                {
                  x: 768,
                  y: 222.5,
                },
                {
                  x: 798,
                  y: 227.5,
                },
                {
                  x: 835,
                  y: 229.5,
                },
                {
                  x: 883,
                  y: 248.5,
                },
                {
                  x: 929,
                  y: 270.5,
                },
                {
                  x: 960,
                  y: 301.5,
                },
                {
                  x: 1002,
                  y: 325.5,
                },
                {
                  x: 1028,
                  y: 341.5,
                },
                {
                  x: 1055,
                  y: 353.5,
                },
                {
                  x: 1091,
                  y: 361.5,
                },
                {
                  x: 1113,
                  y: 376.5,
                },
                {
                  x: 1130,
                  y: 394.5,
                },
                {
                  x: 1128,
                  y: 424.5,
                },
                {
                  x: 1116,
                  y: 437.5,
                },
                {
                  x: 1099,
                  y: 442.5,
                },
                {
                  x: 1049,
                  y: 445.5,
                },
                {
                  x: 1021,
                  y: 445.5,
                },
                {
                  x: 992,
                  y: 444.5,
                },
                {
                  x: 977,
                  y: 436.5,
                },
                {
                  x: 948,
                  y: 413.5,
                },
                {
                  x: 925,
                  y: 393.5,
                },
                {
                  x: 894,
                  y: 382.5,
                },
                {
                  x: 834,
                  y: 370.5,
                },
                {
                  x: 814,
                  y: 358.5,
                },
                {
                  x: 777,
                  y: 344.5,
                },
                {
                  x: 754,
                  y: 343.5,
                },
                {
                  x: 711,
                  y: 345.5,
                },
                {
                  x: 666,
                  y: 356.5,
                },
                {
                  x: 658,
                  y: 381.5,
                },
                {
                  x: 662,
                  y: 411.5,
                },
                {
                  x: 651,
                  y: 427.5,
                },
                {
                  x: 636,
                  y: 431.5,
                },
                {
                  x: 597,
                  y: 434.5,
                },
                {
                  x: 560,
                  y: 440.5,
                },
                {
                  x: 539,
                  y: 449.5,
                },
                {
                  x: 500,
                  y: 454.5,
                },
                {
                  x: 471,
                  y: 455.5,
                },
                {
                  x: 413,
                  y: 454.5,
                },
                {
                  x: 343,
                  y: 454.5,
                },
                {
                  x: 300,
                  y: 457.5,
                },
                {
                  x: 241,
                  y: 458.5,
                },
                {
                  x: 209,
                  y: 452.5,
                },
                {
                  x: 179,
                  y: 435.5,
                },
                {
                  x: 155,
                  y: 438.5,
                },
                {
                  x: 111,
                  y: 437.5,
                },
                {
                  x: 72,
                  y: 437.5,
                },
                {
                  x: 5,
                  y: 441.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8d2b-763a-961d-35ddf8d2911e.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 72.22293075637438,
                  y: 338.92195212900344,
                },
                {
                  x: 55.30750787080225,
                  y: 339.4194645668144,
                },
                {
                  x: 35.40701035836443,
                  y: 336.9319023777597,
                },
                {
                  x: 37.39706010960821,
                  y: 326.9816536215408,
                },
                {
                  x: 46.84979642801618,
                  y: 319.5189670543766,
                },
                {
                  x: 55.80502030861319,
                  y: 303.5985690444263,
                },
                {
                  x: 54.31248299518035,
                  y: 285.19060884542137,
                },
                {
                  x: 47.844821303638064,
                  y: 265.29011133298354,
                },
                {
                  x: 39.38710986085199,
                  y: 241.40951431805817,
                },
                {
                  x: 35.90452279617538,
                  y: 211.0612556115905,
                },
                {
                  x: 32.9194481693097,
                  y: 195.14085760164025,
                },
                {
                  x: 34.411985482742544,
                  y: 176.73289740263527,
                },
                {
                  x: 41.87467204990672,
                  y: 157.32991232800842,
                },
                {
                  x: 52.32243324393657,
                  y: 133.44931531308305,
                },
                {
                  x: 61.77516956234454,
                  y: 121.50901680562035,
                },
                {
                  x: 64.76024418921021,
                  y: 92.65329541258552,
                },
                {
                  x: 65.75526906483209,
                  y: 85.19060884542134,
                },
                {
                  x: 60.282632248911696,
                  y: 87.18065859666513,
                },
                {
                  x: 55.80502030861319,
                  y: 76.73289740263527,
                },
                {
                  x: 52.32243324393657,
                  y: 68.2751859598492,
                },
                {
                  x: 53.814970557369406,
                  y: 54.84235013895368,
                },
                {
                  x: 67.74531881607588,
                  y: 48.37468844741139,
                },
                {
                  x: 88.64084120413558,
                  y: 47.37966357178949,
                },
                {
                  x: 99.58611483597637,
                  y: 49.369713323033274,
                },
                {
                  x: 104.06372677627489,
                  y: 53.349812825520836,
                },
                {
                  x: 122.9691994130908,
                  y: 55.339862576764624,
                },
                {
                  x: 136.89954767179728,
                  y: 50.862250636466115,
                },
                {
                  x: 148.342333741449,
                  y: 48.37468844741139,
                },
                {
                  x: 165.7552690648321,
                  y: 48.872200885222334,
                },
                {
                  x: 181.1781546369714,
                  y: 53.349812825520836,
                },
                {
                  x: 187.14830389070275,
                  y: 60.81249939268502,
                },
                {
                  x: 189.13835364194654,
                  y: 77.72792227825715,
                },
                {
                  x: 188.6408412041356,
                  y: 85.19060884542134,
                },
                {
                  x: 180.18312976134953,
                  y: 78.72294715387905,
                },
                {
                  x: 177.19805513448384,
                  y: 87.67817103447607,
                },
                {
                  x: 181.67566707478235,
                  y: 104.09608148223727,
                },
                {
                  x: 182.1731795125933,
                  y: 122.00652924343129,
                },
                {
                  x: 191.12840339319033,
                  y: 139.41946456681438,
                },
                {
                  x: 201.57616458722018,
                  y: 163.7975740195507,
                },
                {
                  x: 209.03885115438436,
                  y: 186.18563372104325,
                },
                {
                  x: 211.02890090562812,
                  y: 197.62841979069498,
                },
                {
                  x: 206.0537765275187,
                  y: 215.04135511407807,
                },
                {
                  x: 206.0537765275187,
                  y: 229.46921581059547,
                },
                {
                  x: 214.01397553249382,
                  y: 242.40453919368005,
                },
                {
                  x: 223.46671185090176,
                  y: 253.34981282552087,
                },
                {
                  x: 225.45676160214555,
                  y: 280.71299690512285,
                },
                {
                  x: 226.45178647776743,
                  y: 293.64832028820746,
                },
                {
                  x: 227.94432379120028,
                  y: 311.55876804940146,
                },
                {
                  x: 222.47168697527988,
                  y: 324.991603870297,
                },
                {
                  x: 214.01397553249382,
                  y: 325.48911630810795,
                },
                {
                  x: 208.5413387165734,
                  y: 330.96175312402835,
                },
                {
                  x: 194.61099045786693,
                  y: 333.44931531308305,
                },
                {
                  x: 189.63586607975748,
                  y: 338.92195212900344,
                },
                {
                  x: 175.70551782105102,
                  y: 338.92195212900344,
                },
                {
                  x: 157.29755762204604,
                  y: 338.4244396911925,
                },
                {
                  x: 146.8497964280162,
                  y: 337.4294148155706,
                },
                {
                  x: 144.8597466767724,
                  y: 334.94185262651587,
                },
                {
                  x: 116.50153772154852,
                  y: 330.96175312402835,
                },
                {
                  x: 110.03387603000623,
                  y: 331.9567779996502,
                },
              ],
            },
            {
              label: "Cat",
              points: [
                {
                  x: 224.46173672652367,
                  y: 247.87717600960048,
                },
                {
                  x: 225.45676160214555,
                  y: 228.4741909349736,
                },
                {
                  x: 229.93437354244406,
                  y: 215.538867551889,
                },
                {
                  x: 232.4219357314988,
                  y: 209.07120586034674,
                },
                {
                  x: 227.44681135338934,
                  y: 195.6383700394512,
                },
                {
                  x: 219.4866123484142,
                  y: 177.2304098404462,
                },
                {
                  x: 219.4866123484142,
                  y: 158.82244964144124,
                },
                {
                  x: 217.49656259717042,
                  y: 143.39956406930193,
                },
                {
                  x: 227.44681135338934,
                  y: 143.8970765071129,
                },
                {
                  x: 241.3771596120958,
                  y: 156.3348874523865,
                },
                {
                  x: 256.30253274642416,
                  y: 151.85727551208802,
                },
                {
                  x: 265.75526906483213,
                  y: 154.34483770114275,
                },
                {
                  x: 273.71546806980723,
                  y: 154.8423501389537,
                },
                {
                  x: 280.1831297613495,
                  y: 142.902051631491,
                },
                {
                  x: 291.6259158310013,
                  y: 140.9120018802472,
                },
                {
                  x: 295.6060153334888,
                  y: 153.34981282552084,
                },
                {
                  x: 295.6060153334888,
                  y: 182.20553421855567,
                },
                {
                  x: 289.13835364194654,
                  y: 200.1159819797497,
                },
                {
                  x: 287.1483038907028,
                  y: 216.5338924275109,
                },
                {
                  x: 289.6358660797575,
                  y: 233.44931531308305,
                },
                {
                  x: 296.1035277712998,
                  y: 255.8373750145756,
                },
                {
                  x: 300.08362727378733,
                  y: 268.27518595984924,
                },
                {
                  x: 307.0488014031406,
                  y: 278.22543471606815,
                },
                {
                  x: 316.0040252837376,
                  y: 289.6682207857199,
                },
                {
                  x: 315.50651284592664,
                  y: 303.5985690444263,
                },
                {
                  x: 314.0139755324938,
                  y: 314.54384267626716,
                },
                {
                  x: 302.5711894628421,
                  y: 326.9816536215408,
                },
                {
                  x: 295.1085028956779,
                  y: 336.9319023777597,
                },
                {
                  x: 283.1682043882152,
                  y: 342.4045391936801,
                },
                {
                  x: 269.73536856731965,
                  y: 343.39956406930196,
                },
                {
                  x: 258.2925824976679,
                  y: 341.90702675586914,
                },
                {
                  x: 255.80502030861322,
                  y: 339.4194645668144,
                },
                {
                  x: 249.33735861707092,
                  y: 337.92692725338156,
                },
                {
                  x: 242.37218448771767,
                  y: 342.902051631491,
                },
                {
                  x: 227.94432379120028,
                  y: 345.3896138205457,
                },
                {
                  x: 221.97417453746894,
                  y: 337.92692725338156,
                },
                {
                  x: 229.4368611046331,
                  y: 319.5189670543766,
                },
                {
                  x: 229.93437354244406,
                  y: 303.1010566066154,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 300.08362727378733,
                  y: 343.39956406930196,
                },
                {
                  x: 325.45676160214555,
                  y: 342.4045391936801,
                },
                {
                  x: 340.3821347364739,
                  y: 342.902051631491,
                },
                {
                  x: 354.80999543299134,
                  y: 329.4692158105955,
                },
                {
                  x: 364.76024418921025,
                  y: 335.43936506432686,
                },
                {
                  x: 385.158254139459,
                  y: 334.94185262651587,
                },
                {
                  x: 389.13835364194654,
                  y: 339.4194645668144,
                },
                {
                  x: 409.03885115438436,
                  y: 342.4045391936801,
                },
                {
                  x: 435.9045227961754,
                  y: 340.4144894424363,
                },
                {
                  x: 436.40203523398634,
                  y: 335.9368775021378,
                },
                {
                  x: 449.8348710548819,
                  y: 333.946827750894,
                },
                {
                  x: 458.7900949354789,
                  y: 323.49906655686414,
                },
                {
                  x: 471.22790588075253,
                  y: 320.5139919299985,
                },
                {
                  x: 487.6458163285137,
                  y: 319.0214546165656,
                },
                {
                  x: 480.6806421991605,
                  y: 301.1110068553716,
                },
                {
                  x: 474.71049294542917,
                  y: 292.6532954125855,
                },
                {
                  x: 462.7701944379665,
                  y: 271.2602605867149,
                },
                {
                  x: 461.77516956234456,
                  y: 252.8523003877099,
                },
                {
                  x: 455.8050203086132,
                  y: 239.41946456681438,
                },
                {
                  x: 448.34233374144907,
                  y: 228.97170337278453,
                },
                {
                  x: 448.34233374144907,
                  y: 219.5189670543766,
                },
                {
                  x: 450.82989593050377,
                  y: 207.5786685469139,
                },
                {
                  x: 453.81497055736946,
                  y: 191.1607580991527,
                },
                {
                  x: 456.8000451842351,
                  y: 186.18563372104325,
                },
                {
                  x: 456.30253274642416,
                  y: 179.71797202950094,
                },
                {
                  x: 454.3124829951804,
                  y: 150.86225063646611,
                },
                {
                  x: 450.3323834926928,
                  y: 123.00155411905318,
                },
                {
                  x: 449.33735861707095,
                  y: 105.09110635785915,
                },
                {
                  x: 446.35228399020525,
                  y: 94.6433451638293,
                },
                {
                  x: 444.85974667677243,
                  y: 86.18563372104323,
                },
                {
                  x: 437.3970601096083,
                  y: 78.72294715387905,
                },
                {
                  x: 437.3970601096083,
                  y: 64.79259889517259,
                },
                {
                  x: 432.91944816930976,
                  y: 57.827424765819345,
                },
                {
                  x: 426.9492989155784,
                  y: 47.37966357178949,
                },
                {
                  x: 416.00402528373763,
                  y: 33.94682775089397,
                },
                {
                  x: 403.56621433846396,
                  y: 26.981653621540737,
                },
                {
                  x: 391.6259158310013,
                  y: 26.981653621540737,
                },
                {
                  x: 380.18312976134956,
                  y: 30.464240686217355,
                },
                {
                  x: 368.7403436916978,
                  y: 35.43936506432681,
                },
                {
                  x: 354.80999543299134,
                  y: 47.87717600960044,
                },
                {
                  x: 347.34730886582713,
                  y: 64.29508645736163,
                },
                {
                  x: 337.3970601096082,
                  y: 75.24036008920244,
                },
                {
                  x: 332.42193573149876,
                  y: 95.14085760164025,
                },
                {
                  x: 331.9244232936878,
                  y: 115.04135511407806,
                },
                {
                  x: 328.9393486668222,
                  y: 132.45429043746114,
                },
                {
                  x: 323.4667118509018,
                  y: 144.89210138273478,
                },
                {
                  x: 313.5164630946829,
                  y: 151.35976307427705,
                },
                {
                  x: 306.55128896532966,
                  y: 166.78264864641636,
                },
                {
                  x: 306.05377652751866,
                  y: 176.73289740263527,
                },
                {
                  x: 302.5711894628421,
                  y: 190.1657332235308,
                },
                {
                  x: 300.08362727378733,
                  y: 203.10105660661537,
                },
                {
                  x: 300.58113971159827,
                  y: 221.50901680562035,
                },
                {
                  x: 304.56123921408584,
                  y: 239.91697700462532,
                },
                {
                  x: 307.0488014031406,
                  y: 253.8473252633318,
                },
                {
                  x: 315.0090004081157,
                  y: 271.7577730245258,
                },
                {
                  x: 321.476662099658,
                  y: 284.1955839697995,
                },
                {
                  x: 322.96919941309085,
                  y: 295.6383700394512,
                },
                {
                  x: 321.476662099658,
                  y: 310.06623073596865,
                },
              ],
            },
            {
              label: "Cat",
              points: [
                {
                  x: 483.6657168260262,
                  y: 341.90702675586914,
                },
                {
                  x: 501.5761645872202,
                  y: 343.39956406930196,
                },
                {
                  x: 514.5114879703048,
                  y: 340.91200188024726,
                },
                {
                  x: 516.5015377215485,
                  y: 327.4791660593517,
                },
                {
                  x: 521.476662099658,
                  y: 327.4791660593517,
                },
                {
                  x: 521.476662099658,
                  y: 335.9368775021378,
                },
                {
                  x: 527.4468113533893,
                  y: 342.902051631491,
                },
                {
                  x: 548.342333741449,
                  y: 341.90702675586914,
                },
                {
                  x: 552.8199456817475,
                  y: 340.4144894424363,
                },
                {
                  x: 553.8149705573694,
                  y: 326.9816536215408,
                },
                {
                  x: 552.8199456817475,
                  y: 320.5139919299985,
                },
                {
                  x: 562.2726820001556,
                  y: 316.5338924275109,
                },
                {
                  x: 575.7055178210511,
                  y: 318.5239421787547,
                },
                {
                  x: 580.6806421991605,
                  y: 315.53886755188904,
                },
                {
                  x: 581.1781546369715,
                  y: 291.1607580991527,
                },
                {
                  x: 587.1483038907028,
                  y: 270.76274814890394,
                },
                {
                  x: 587.6458163285138,
                  y: 258.3249372036303,
                },
                {
                  x: 582.1731795125934,
                  y: 233.44931531308305,
                },
                {
                  x: 577.6955675722949,
                  y: 212.0562804872124,
                },
                {
                  x: 575.2080053832401,
                  y: 199.12095710412783,
                },
                {
                  x: 575.7055178210511,
                  y: 186.18563372104325,
                },
                {
                  x: 575.2080053832401,
                  y: 175.24036008920245,
                },
                {
                  x: 575.2080053832401,
                  y: 163.30006158173975,
                },
                {
                  x: 579.6856173235386,
                  y: 148.3746884474114,
                },
                {
                  x: 575.7055178210511,
                  y: 144.89210138273478,
                },
                {
                  x: 565.7552690648322,
                  y: 146.38463869616763,
                },
                {
                  x: 548.83984617926,
                  y: 142.40453919368005,
                },
                {
                  x: 532.9194481693097,
                  y: 140.41448944243626,
                },
                {
                  x: 521.9741745374689,
                  y: 139.41946456681438,
                },
                {
                  x: 507.54631384095154,
                  y: 133.946827750894,
                },
                {
                  x: 497.59606508473263,
                  y: 131.45926556183926,
                },
                {
                  x: 491.6259158310013,
                  y: 139.41946456681438,
                },
                {
                  x: 492.6209407066232,
                  y: 148.3746884474114,
                },
                {
                  x: 486.1532790150809,
                  y: 160.3149869548741,
                },
                {
                  x: 478.19308001010575,
                  y: 175.24036008920245,
                },
                {
                  x: 475.2080053832401,
                  y: 191.65827053696364,
                },
                {
                  x: 471.22790588075253,
                  y: 204.09608148223728,
                },
                {
                  x: 464.2627317513993,
                  y: 218.52394217875468,
                },
                {
                  x: 459.7851198111008,
                  y: 236.43438993994872,
                },
                {
                  x: 460.7801446867227,
                  y: 244.39458894492384,
                },
                {
                  x: 468.2428312538869,
                  y: 276.7328974026353,
                },
                {
                  x: 474.71049294542917,
                  y: 286.6831461588542,
                },
                {
                  x: 482.67069195040426,
                  y: 302.1060317309935,
                },
                {
                  x: 486.65079145289184,
                  y: 313.0513053628343,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 567,
                  y: 338,
                },
                {
                  x: 581,
                  y: 343,
                },
                {
                  x: 603,
                  y: 344,
                },
                {
                  x: 615,
                  y: 336,
                },
                {
                  x: 625,
                  y: 336,
                },
                {
                  x: 649,
                  y: 339,
                },
                {
                  x: 670,
                  y: 339,
                },
                {
                  x: 688,
                  y: 341,
                },
                {
                  x: 704,
                  y: 343,
                },
                {
                  x: 719,
                  y: 339,
                },
                {
                  x: 735,
                  y: 337,
                },
                {
                  x: 740,
                  y: 315,
                },
                {
                  x: 727,
                  y: 317,
                },
                {
                  x: 724,
                  y: 308,
                },
                {
                  x: 719,
                  y: 294,
                },
                {
                  x: 714,
                  y: 284,
                },
                {
                  x: 715,
                  y: 271,
                },
                {
                  x: 722,
                  y: 256,
                },
                {
                  x: 724,
                  y: 241,
                },
                {
                  x: 725,
                  y: 225,
                },
                {
                  x: 729,
                  y: 204,
                },
                {
                  x: 728,
                  y: 194,
                },
                {
                  x: 719,
                  y: 174,
                },
                {
                  x: 712,
                  y: 163,
                },
                {
                  x: 709,
                  y: 154,
                },
                {
                  x: 714,
                  y: 140,
                },
                {
                  x: 711,
                  y: 120,
                },
                {
                  x: 708,
                  y: 106,
                },
                {
                  x: 705,
                  y: 95,
                },
                {
                  x: 716,
                  y: 82,
                },
                {
                  x: 716,
                  y: 70,
                },
                {
                  x: 713,
                  y: 55,
                },
                {
                  x: 710,
                  y: 38,
                },
                {
                  x: 702,
                  y: 20,
                },
                {
                  x: 694,
                  y: 20,
                },
                {
                  x: 681,
                  y: 26,
                },
                {
                  x: 677,
                  y: 32,
                },
                {
                  x: 669,
                  y: 53,
                },
                {
                  x: 669,
                  y: 68,
                },
                {
                  x: 667,
                  y: 73,
                },
                {
                  x: 647,
                  y: 76,
                },
                {
                  x: 636,
                  y: 84,
                },
                {
                  x: 625,
                  y: 79,
                },
                {
                  x: 613,
                  y: 76,
                },
                {
                  x: 602,
                  y: 73,
                },
                {
                  x: 589,
                  y: 74,
                },
                {
                  x: 579,
                  y: 79,
                },
                {
                  x: 573,
                  y: 88,
                },
                {
                  x: 576,
                  y: 99,
                },
                {
                  x: 588,
                  y: 109,
                },
                {
                  x: 594,
                  y: 118,
                },
                {
                  x: 609,
                  y: 123,
                },
                {
                  x: 623,
                  y: 127,
                },
                {
                  x: 634,
                  y: 139,
                },
                {
                  x: 635,
                  y: 150,
                },
                {
                  x: 620,
                  y: 166,
                },
                {
                  x: 615,
                  y: 173,
                },
                {
                  x: 606,
                  y: 193,
                },
                {
                  x: 603,
                  y: 203,
                },
                {
                  x: 598,
                  y: 224,
                },
                {
                  x: 594,
                  y: 239,
                },
                {
                  x: 592,
                  y: 255,
                },
                {
                  x: 591,
                  y: 271,
                },
                {
                  x: 589,
                  y: 285,
                },
                {
                  x: 577,
                  y: 318,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8d52-757f-9b39-e6821e40334f.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 684,
                  y: 2636,
                },
                {
                  x: 776,
                  y: 2632,
                },
                {
                  x: 848,
                  y: 2632,
                },
                {
                  x: 932,
                  y: 2616,
                },
                {
                  x: 1020,
                  y: 2596,
                },
                {
                  x: 1068,
                  y: 2572,
                },
                {
                  x: 1088,
                  y: 2532,
                },
                {
                  x: 1180,
                  y: 2452,
                },
                {
                  x: 1224,
                  y: 2412,
                },
                {
                  x: 1284,
                  y: 2376,
                },
                {
                  x: 1368,
                  y: 2324,
                },
                {
                  x: 1440,
                  y: 2284,
                },
                {
                  x: 1472,
                  y: 2248,
                },
                {
                  x: 1520,
                  y: 2256,
                },
                {
                  x: 1612,
                  y: 2276,
                },
                {
                  x: 1692,
                  y: 2292,
                },
                {
                  x: 1772,
                  y: 2312,
                },
                {
                  x: 1848,
                  y: 2332,
                },
                {
                  x: 1928,
                  y: 2336,
                },
                {
                  x: 2000,
                  y: 2344,
                },
                {
                  x: 2072,
                  y: 2344,
                },
                {
                  x: 2124,
                  y: 2328,
                },
                {
                  x: 2132,
                  y: 2296,
                },
                {
                  x: 2184,
                  y: 2320,
                },
                {
                  x: 2212,
                  y: 2364,
                },
                {
                  x: 2252,
                  y: 2456,
                },
                {
                  x: 2280,
                  y: 2512,
                },
                {
                  x: 2300,
                  y: 2572,
                },
                {
                  x: 2316,
                  y: 2636,
                },
                {
                  x: 2396,
                  y: 2664,
                },
                {
                  x: 2492,
                  y: 2680,
                },
                {
                  x: 2584,
                  y: 2680,
                },
                {
                  x: 2656,
                  y: 2668,
                },
                {
                  x: 2708,
                  y: 2592,
                },
                {
                  x: 2700,
                  y: 2536,
                },
                {
                  x: 2660,
                  y: 2480,
                },
                {
                  x: 2600,
                  y: 2444,
                },
                {
                  x: 2560,
                  y: 2420,
                },
                {
                  x: 2532,
                  y: 2388,
                },
                {
                  x: 2500,
                  y: 2328,
                },
                {
                  x: 2496,
                  y: 2308,
                },
                {
                  x: 2524,
                  y: 2284,
                },
                {
                  x: 2552,
                  y: 2244,
                },
                {
                  x: 2560,
                  y: 2172,
                },
                {
                  x: 2572,
                  y: 2116,
                },
                {
                  x: 2580,
                  y: 2052,
                },
                {
                  x: 2584,
                  y: 1988,
                },
                {
                  x: 2584,
                  y: 1932,
                },
                {
                  x: 2576,
                  y: 1852,
                },
                {
                  x: 2560,
                  y: 1756,
                },
                {
                  x: 2544,
                  y: 1652,
                },
                {
                  x: 2516,
                  y: 1564,
                },
                {
                  x: 2492,
                  y: 1492,
                },
                {
                  x: 2464,
                  y: 1448,
                },
                {
                  x: 2388,
                  y: 1372,
                },
                {
                  x: 2336,
                  y: 1348,
                },
                {
                  x: 2300,
                  y: 1236,
                },
                {
                  x: 2272,
                  y: 1132,
                },
                {
                  x: 2248,
                  y: 1068,
                },
                {
                  x: 2216,
                  y: 960,
                },
                {
                  x: 2188,
                  y: 872,
                },
                {
                  x: 2140,
                  y: 768,
                },
                {
                  x: 2084,
                  y: 652,
                },
                {
                  x: 2024,
                  y: 584,
                },
                {
                  x: 1980,
                  y: 552,
                },
                {
                  x: 1924,
                  y: 536,
                },
                {
                  x: 1864,
                  y: 520,
                },
                {
                  x: 1828,
                  y: 520,
                },
                {
                  x: 1804,
                  y: 564,
                },
                {
                  x: 1820,
                  y: 592,
                },
                {
                  x: 1872,
                  y: 648,
                },
                {
                  x: 1908,
                  y: 700,
                },
                {
                  x: 1944,
                  y: 776,
                },
                {
                  x: 1960,
                  y: 836,
                },
                {
                  x: 1972,
                  y: 884,
                },
                {
                  x: 1984,
                  y: 980,
                },
                {
                  x: 1992,
                  y: 1048,
                },
                {
                  x: 2012,
                  y: 1144,
                },
                {
                  x: 2032,
                  y: 1208,
                },
                {
                  x: 1980,
                  y: 1208,
                },
                {
                  x: 1920,
                  y: 1192,
                },
                {
                  x: 1828,
                  y: 1200,
                },
                {
                  x: 1804,
                  y: 1248,
                },
                {
                  x: 1788,
                  y: 1272,
                },
                {
                  x: 1748,
                  y: 1292,
                },
                {
                  x: 1692,
                  y: 1304,
                },
                {
                  x: 1588,
                  y: 1328,
                },
                {
                  x: 1524,
                  y: 1320,
                },
                {
                  x: 1440,
                  y: 1288,
                },
                {
                  x: 1376,
                  y: 1296,
                },
                {
                  x: 1332,
                  y: 1268,
                },
                {
                  x: 1304,
                  y: 1240,
                },
                {
                  x: 1280,
                  y: 1204,
                },
                {
                  x: 1248,
                  y: 1156,
                },
                {
                  x: 1224,
                  y: 1092,
                },
                {
                  x: 1220,
                  y: 1040,
                },
                {
                  x: 1196,
                  y: 976,
                },
                {
                  x: 1176,
                  y: 936,
                },
                {
                  x: 1152,
                  y: 892,
                },
                {
                  x: 1128,
                  y: 868,
                },
                {
                  x: 1096,
                  y: 844,
                },
                {
                  x: 1068,
                  y: 824,
                },
                {
                  x: 1020,
                  y: 812,
                },
                {
                  x: 980,
                  y: 852,
                },
                {
                  x: 968,
                  y: 900,
                },
                {
                  x: 952,
                  y: 956,
                },
                {
                  x: 932,
                  y: 1012,
                },
                {
                  x: 916,
                  y: 1076,
                },
                {
                  x: 880,
                  y: 1112,
                },
                {
                  x: 840,
                  y: 1120,
                },
                {
                  x: 784,
                  y: 1128,
                },
                {
                  x: 736,
                  y: 1112,
                },
                {
                  x: 684,
                  y: 1096,
                },
                {
                  x: 652,
                  y: 1084,
                },
                {
                  x: 620,
                  y: 1068,
                },
                {
                  x: 580,
                  y: 1056,
                },
                {
                  x: 500,
                  y: 1016,
                },
                {
                  x: 464,
                  y: 1008,
                },
                {
                  x: 440,
                  y: 1016,
                },
                {
                  x: 460,
                  y: 1084,
                },
                {
                  x: 492,
                  y: 1128,
                },
                {
                  x: 524,
                  y: 1180,
                },
                {
                  x: 548,
                  y: 1220,
                },
                {
                  x: 568,
                  y: 1256,
                },
                {
                  x: 556,
                  y: 1296,
                },
                {
                  x: 540,
                  y: 1340,
                },
                {
                  x: 512,
                  y: 1380,
                },
                {
                  x: 508,
                  y: 1416,
                },
                {
                  x: 504,
                  y: 1464,
                },
                {
                  x: 512,
                  y: 1504,
                },
                {
                  x: 508,
                  y: 1564,
                },
                {
                  x: 516,
                  y: 1592,
                },
                {
                  x: 524,
                  y: 1620,
                },
                {
                  x: 524,
                  y: 1652,
                },
                {
                  x: 520,
                  y: 1704,
                },
                {
                  x: 520,
                  y: 1740,
                },
                {
                  x: 532,
                  y: 1776,
                },
                {
                  x: 576,
                  y: 1792,
                },
                {
                  x: 624,
                  y: 1816,
                },
                {
                  x: 664,
                  y: 1836,
                },
                {
                  x: 720,
                  y: 1852,
                },
                {
                  x: 788,
                  y: 1856,
                },
                {
                  x: 848,
                  y: 1844,
                },
                {
                  x: 916,
                  y: 1828,
                },
                {
                  x: 944,
                  y: 1824,
                },
                {
                  x: 964,
                  y: 1860,
                },
                {
                  x: 980,
                  y: 1900,
                },
                {
                  x: 1012,
                  y: 1952,
                },
                {
                  x: 1036,
                  y: 2004,
                },
                {
                  x: 1080,
                  y: 2048,
                },
                {
                  x: 1120,
                  y: 2080,
                },
                {
                  x: 1080,
                  y: 2140,
                },
                {
                  x: 1048,
                  y: 2192,
                },
                {
                  x: 1016,
                  y: 2264,
                },
                {
                  x: 988,
                  y: 2312,
                },
                {
                  x: 936,
                  y: 2364,
                },
                {
                  x: 908,
                  y: 2380,
                },
                {
                  x: 868,
                  y: 2412,
                },
                {
                  x: 840,
                  y: 2436,
                },
                {
                  x: 804,
                  y: 2432,
                },
                {
                  x: 712,
                  y: 2464,
                },
                {
                  x: 676,
                  y: 2516,
                },
                {
                  x: 652,
                  y: 2572,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8f9f-71e9-bf59-aebc62e010da.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 505,
                  y: 712,
                },
                {
                  x: 502,
                  y: 695,
                },
                {
                  x: 494,
                  y: 685,
                },
                {
                  x: 483,
                  y: 675,
                },
                {
                  x: 485,
                  y: 659,
                },
                {
                  x: 501,
                  y: 647,
                },
                {
                  x: 512,
                  y: 646,
                },
                {
                  x: 513,
                  y: 616,
                },
                {
                  x: 507,
                  y: 581,
                },
                {
                  x: 496,
                  y: 545,
                },
                {
                  x: 483,
                  y: 508,
                },
                {
                  x: 469,
                  y: 466,
                },
                {
                  x: 449,
                  y: 439,
                },
                {
                  x: 427,
                  y: 398,
                },
                {
                  x: 412,
                  y: 361,
                },
                {
                  x: 398,
                  y: 301,
                },
                {
                  x: 389,
                  y: 278,
                },
                {
                  x: 373,
                  y: 257,
                },
                {
                  x: 358,
                  y: 238,
                },
                {
                  x: 350,
                  y: 208,
                },
                {
                  x: 347,
                  y: 190,
                },
                {
                  x: 343,
                  y: 149,
                },
                {
                  x: 350,
                  y: 125,
                },
                {
                  x: 351,
                  y: 107,
                },
                {
                  x: 349,
                  y: 88,
                },
                {
                  x: 346,
                  y: 75,
                },
                {
                  x: 340,
                  y: 51,
                },
                {
                  x: 341,
                  y: 35,
                },
                {
                  x: 356,
                  y: 32,
                },
                {
                  x: 371,
                  y: 41,
                },
                {
                  x: 392,
                  y: 57,
                },
                {
                  x: 408,
                  y: 70,
                },
                {
                  x: 435,
                  y: 72,
                },
                {
                  x: 457,
                  y: 68,
                },
                {
                  x: 480,
                  y: 64,
                },
                {
                  x: 495,
                  y: 58,
                },
                {
                  x: 506,
                  y: 43,
                },
                {
                  x: 521,
                  y: 30,
                },
                {
                  x: 537,
                  y: 23,
                },
                {
                  x: 546,
                  y: 30,
                },
                {
                  x: 547,
                  y: 50,
                },
                {
                  x: 548,
                  y: 75,
                },
                {
                  x: 550,
                  y: 94,
                },
                {
                  x: 557,
                  y: 119,
                },
                {
                  x: 563,
                  y: 142,
                },
                {
                  x: 565,
                  y: 152,
                },
                {
                  x: 572,
                  y: 174,
                },
                {
                  x: 578,
                  y: 191,
                },
                {
                  x: 586,
                  y: 198,
                },
                {
                  x: 606,
                  y: 209,
                },
                {
                  x: 631,
                  y: 219,
                },
                {
                  x: 655,
                  y: 226,
                },
                {
                  x: 682,
                  y: 236,
                },
                {
                  x: 707,
                  y: 247,
                },
                {
                  x: 750,
                  y: 274,
                },
                {
                  x: 772,
                  y: 300,
                },
                {
                  x: 790,
                  y: 322,
                },
                {
                  x: 806,
                  y: 347,
                },
                {
                  x: 815,
                  y: 372,
                },
                {
                  x: 827,
                  y: 407,
                },
                {
                  x: 836,
                  y: 443,
                },
                {
                  x: 845,
                  y: 493,
                },
                {
                  x: 848,
                  y: 525,
                },
                {
                  x: 852,
                  y: 546,
                },
                {
                  x: 852,
                  y: 574,
                },
                {
                  x: 847,
                  y: 599,
                },
                {
                  x: 867,
                  y: 618,
                },
                {
                  x: 895,
                  y: 636,
                },
                {
                  x: 913,
                  y: 649,
                },
                {
                  x: 938,
                  y: 659,
                },
                {
                  x: 952,
                  y: 673,
                },
                {
                  x: 976,
                  y: 671,
                },
                {
                  x: 998,
                  y: 673,
                },
                {
                  x: 1015,
                  y: 684,
                },
                {
                  x: 1036,
                  y: 693,
                },
                {
                  x: 1049,
                  y: 707,
                },
                {
                  x: 1050,
                  y: 714,
                },
                {
                  x: 924,
                  y: 716,
                },
                {
                  x: 914,
                  y: 704,
                },
                {
                  x: 911,
                  y: 692,
                },
                {
                  x: 903,
                  y: 677,
                },
                {
                  x: 889,
                  y: 676,
                },
                {
                  x: 863,
                  y: 679,
                },
                {
                  x: 838,
                  y: 681,
                },
                {
                  x: 804,
                  y: 685,
                },
                {
                  x: 769,
                  y: 685,
                },
                {
                  x: 725,
                  y: 688,
                },
                {
                  x: 692,
                  y: 693,
                },
                {
                  x: 662,
                  y: 700,
                },
                {
                  x: 633,
                  y: 699,
                },
                {
                  x: 618,
                  y: 695,
                },
                {
                  x: 609,
                  y: 680,
                },
                {
                  x: 609,
                  y: 672,
                },
                {
                  x: 588,
                  y: 670,
                },
                {
                  x: 582,
                  y: 671,
                },
                {
                  x: 575,
                  y: 692,
                },
                {
                  x: 568,
                  y: 710,
                },
                {
                  x: 549,
                  y: 712,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8fcb-72ef-a132-ef8a062148db.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 27,
                  y: 455,
                },
                {
                  x: 11,
                  y: 446,
                },
                {
                  x: 0,
                  y: 436,
                },
                {
                  x: 2,
                  y: 410,
                },
                {
                  x: 25,
                  y: 396,
                },
                {
                  x: 52,
                  y: 396,
                },
                {
                  x: 91,
                  y: 390,
                },
                {
                  x: 134,
                  y: 386,
                },
                {
                  x: 173,
                  y: 374,
                },
                {
                  x: 208,
                  y: 363,
                },
                {
                  x: 236,
                  y: 355,
                },
                {
                  x: 268,
                  y: 345,
                },
                {
                  x: 305,
                  y: 338,
                },
                {
                  x: 326,
                  y: 326,
                },
                {
                  x: 335,
                  y: 298,
                },
                {
                  x: 337,
                  y: 282,
                },
                {
                  x: 340,
                  y: 265,
                },
                {
                  x: 362,
                  y: 235,
                },
                {
                  x: 371,
                  y: 221,
                },
                {
                  x: 354,
                  y: 204,
                },
                {
                  x: 352,
                  y: 192,
                },
                {
                  x: 374,
                  y: 191,
                },
                {
                  x: 398,
                  y: 188,
                },
                {
                  x: 419,
                  y: 180,
                },
                {
                  x: 433,
                  y: 157,
                },
                {
                  x: 458,
                  y: 126,
                },
                {
                  x: 484,
                  y: 116,
                },
                {
                  x: 526,
                  y: 110,
                },
                {
                  x: 563,
                  y: 112,
                },
                {
                  x: 605,
                  y: 115,
                },
                {
                  x: 654,
                  y: 121,
                },
                {
                  x: 693,
                  y: 128,
                },
                {
                  x: 717,
                  y: 136,
                },
                {
                  x: 737,
                  y: 141,
                },
                {
                  x: 789,
                  y: 140,
                },
                {
                  x: 858,
                  y: 140,
                },
                {
                  x: 893,
                  y: 153,
                },
                {
                  x: 927,
                  y: 176,
                },
                {
                  x: 976,
                  y: 203,
                },
                {
                  x: 1021,
                  y: 218,
                },
                {
                  x: 1039,
                  y: 231,
                },
                {
                  x: 1054,
                  y: 244,
                },
                {
                  x: 1062,
                  y: 265,
                },
                {
                  x: 1075,
                  y: 283,
                },
                {
                  x: 1095,
                  y: 291,
                },
                {
                  x: 1089,
                  y: 307,
                },
                {
                  x: 1061,
                  y: 324,
                },
                {
                  x: 1046,
                  y: 304,
                },
                {
                  x: 1024,
                  y: 289,
                },
                {
                  x: 995,
                  y: 276,
                },
                {
                  x: 949,
                  y: 261,
                },
                {
                  x: 903,
                  y: 262,
                },
                {
                  x: 862,
                  y: 265,
                },
                {
                  x: 843,
                  y: 260,
                },
                {
                  x: 824,
                  y: 238,
                },
                {
                  x: 813,
                  y: 228,
                },
                {
                  x: 795,
                  y: 211,
                },
                {
                  x: 794,
                  y: 205,
                },
                {
                  x: 801,
                  y: 188,
                },
                {
                  x: 803,
                  y: 172,
                },
                {
                  x: 800,
                  y: 161,
                },
                {
                  x: 786,
                  y: 167,
                },
                {
                  x: 759,
                  y: 174,
                },
                {
                  x: 722,
                  y: 175,
                },
                {
                  x: 682,
                  y: 177,
                },
                {
                  x: 658,
                  y: 177,
                },
                {
                  x: 638,
                  y: 179,
                },
                {
                  x: 621,
                  y: 173,
                },
                {
                  x: 604,
                  y: 168,
                },
                {
                  x: 593,
                  y: 168,
                },
                {
                  x: 590,
                  y: 176,
                },
                {
                  x: 593,
                  y: 188,
                },
                {
                  x: 600,
                  y: 204,
                },
                {
                  x: 602,
                  y: 237,
                },
                {
                  x: 598,
                  y: 252,
                },
                {
                  x: 591,
                  y: 265,
                },
                {
                  x: 587,
                  y: 288,
                },
                {
                  x: 586,
                  y: 307,
                },
                {
                  x: 591,
                  y: 320,
                },
                {
                  x: 597,
                  y: 335,
                },
                {
                  x: 597,
                  y: 363,
                },
                {
                  x: 579,
                  y: 375,
                },
                {
                  x: 574,
                  y: 384,
                },
                {
                  x: 576,
                  y: 398,
                },
                {
                  x: 580,
                  y: 415,
                },
                {
                  x: 573,
                  y: 446,
                },
                {
                  x: 567,
                  y: 455,
                },
                {
                  x: 541,
                  y: 454,
                },
                {
                  x: 504,
                  y: 455,
                },
                {
                  x: 458,
                  y: 458,
                },
                {
                  x: 430,
                  y: 460,
                },
                {
                  x: 384,
                  y: 458,
                },
                {
                  x: 346,
                  y: 458,
                },
                {
                  x: 314,
                  y: 460,
                },
                {
                  x: 272,
                  y: 456,
                },
                {
                  x: 237,
                  y: 446,
                },
                {
                  x: 210,
                  y: 449,
                },
                {
                  x: 168,
                  y: 450,
                },
              ],
            },
            {
              label: "Cat",
              points: [
                {
                  x: 1147,
                  y: 446,
                },
                {
                  x: 598,
                  y: 458,
                },
                {
                  x: 591,
                  y: 452,
                },
                {
                  x: 586,
                  y: 444,
                },
                {
                  x: 584,
                  y: 437,
                },
                {
                  x: 584,
                  y: 428,
                },
                {
                  x: 585,
                  y: 408,
                },
                {
                  x: 581,
                  y: 392,
                },
                {
                  x: 588,
                  y: 377,
                },
                {
                  x: 602,
                  y: 363,
                },
                {
                  x: 603,
                  y: 344,
                },
                {
                  x: 602,
                  y: 328,
                },
                {
                  x: 593,
                  y: 314,
                },
                {
                  x: 592,
                  y: 293,
                },
                {
                  x: 592,
                  y: 276,
                },
                {
                  x: 600,
                  y: 254,
                },
                {
                  x: 605,
                  y: 243,
                },
                {
                  x: 609,
                  y: 232,
                },
                {
                  x: 602,
                  y: 210,
                },
                {
                  x: 602,
                  y: 198,
                },
                {
                  x: 600,
                  y: 185,
                },
                {
                  x: 601,
                  y: 173,
                },
                {
                  x: 617,
                  y: 174,
                },
                {
                  x: 636,
                  y: 180,
                },
                {
                  x: 665,
                  y: 181,
                },
                {
                  x: 693,
                  y: 180,
                },
                {
                  x: 727,
                  y: 175,
                },
                {
                  x: 748,
                  y: 175,
                },
                {
                  x: 760,
                  y: 178,
                },
                {
                  x: 787,
                  y: 168,
                },
                {
                  x: 804,
                  y: 162,
                },
                {
                  x: 800,
                  y: 174,
                },
                {
                  x: 796,
                  y: 196,
                },
                {
                  x: 795,
                  y: 207,
                },
                {
                  x: 816,
                  y: 238,
                },
                {
                  x: 824,
                  y: 249,
                },
                {
                  x: 843,
                  y: 260,
                },
                {
                  x: 863,
                  y: 266,
                },
                {
                  x: 888,
                  y: 265,
                },
                {
                  x: 931,
                  y: 263,
                },
                {
                  x: 977,
                  y: 276,
                },
                {
                  x: 1014,
                  y: 286,
                },
                {
                  x: 1039,
                  y: 302,
                },
                {
                  x: 1045,
                  y: 315,
                },
                {
                  x: 1057,
                  y: 326,
                },
                {
                  x: 1102,
                  y: 294,
                },
                {
                  x: 1112,
                  y: 287,
                },
                {
                  x: 1140,
                  y: 273,
                },
                {
                  x: 1175,
                  y: 261,
                },
                {
                  x: 1197,
                  y: 266,
                },
                {
                  x: 1196,
                  y: 330,
                },
                {
                  x: 1175,
                  y: 331,
                },
                {
                  x: 1155,
                  y: 341,
                },
                {
                  x: 1133,
                  y: 359,
                },
                {
                  x: 1122,
                  y: 370,
                },
                {
                  x: 1116,
                  y: 378,
                },
                {
                  x: 1120,
                  y: 397,
                },
                {
                  x: 1136,
                  y: 412,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-8fef-74ef-8777-8c2a8e10b4db.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 253,
                  y: 288.5,
                },
                {
                  x: 250,
                  y: 262.5,
                },
                {
                  x: 254,
                  y: 232.5,
                },
                {
                  x: 264,
                  y: 204.5,
                },
                {
                  x: 276,
                  y: 172.5,
                },
                {
                  x: 284,
                  y: 141.5,
                },
                {
                  x: 289,
                  y: 134.5,
                },
                {
                  x: 287,
                  y: 125.5,
                },
                {
                  x: 271,
                  y: 108.5,
                },
                {
                  x: 275,
                  y: 93.5,
                },
                {
                  x: 282,
                  y: 64.5,
                },
                {
                  x: 289,
                  y: 51.5,
                },
                {
                  x: 301,
                  y: 43.5,
                },
                {
                  x: 308,
                  y: 35.5,
                },
                {
                  x: 328,
                  y: 27.5,
                },
                {
                  x: 357,
                  y: 23.5,
                },
                {
                  x: 381,
                  y: 24.5,
                },
                {
                  x: 388,
                  y: 36.5,
                },
                {
                  x: 397,
                  y: 52.5,
                },
                {
                  x: 410,
                  y: 61.5,
                },
                {
                  x: 415,
                  y: 76.5,
                },
                {
                  x: 415,
                  y: 96.5,
                },
                {
                  x: 406,
                  y: 117.5,
                },
                {
                  x: 406,
                  y: 143.5,
                },
                {
                  x: 417,
                  y: 166.5,
                },
                {
                  x: 421,
                  y: 195.5,
                },
                {
                  x: 420,
                  y: 215.5,
                },
                {
                  x: 434,
                  y: 220.5,
                },
                {
                  x: 444,
                  y: 217.5,
                },
                {
                  x: 461,
                  y: 226.5,
                },
                {
                  x: 471,
                  y: 239.5,
                },
                {
                  x: 473,
                  y: 252.5,
                },
                {
                  x: 472,
                  y: 272.5,
                },
                {
                  x: 485,
                  y: 279.5,
                },
                {
                  x: 498,
                  y: 287.5,
                },
                {
                  x: 496,
                  y: 295.5,
                },
                {
                  x: 470,
                  y: 296.5,
                },
                {
                  x: 461,
                  y: 301.5,
                },
                {
                  x: 431,
                  y: 306.5,
                },
                {
                  x: 397,
                  y: 304.5,
                },
                {
                  x: 387,
                  y: 297.5,
                },
                {
                  x: 369,
                  y: 286.5,
                },
                {
                  x: 343,
                  y: 287.5,
                },
                {
                  x: 335,
                  y: 293.5,
                },
                {
                  x: 326,
                  y: 298.5,
                },
                {
                  x: 304,
                  y: 296.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-901d-730f-a0ac-9824b78220a7.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 137,
                  y: 435.5,
                },
                {
                  x: 113,
                  y: 439.5,
                },
                {
                  x: 88,
                  y: 439.5,
                },
                {
                  x: 86,
                  y: 431.5,
                },
                {
                  x: 96,
                  y: 418.5,
                },
                {
                  x: 101,
                  y: 407.5,
                },
                {
                  x: 120,
                  y: 400.5,
                },
                {
                  x: 121,
                  y: 387.5,
                },
                {
                  x: 124,
                  y: 374.5,
                },
                {
                  x: 117,
                  y: 355.5,
                },
                {
                  x: 115,
                  y: 336.5,
                },
                {
                  x: 107,
                  y: 309.5,
                },
                {
                  x: 103,
                  y: 290.5,
                },
                {
                  x: 96,
                  y: 279.5,
                },
                {
                  x: 76,
                  y: 251.5,
                },
                {
                  x: 62,
                  y: 224.5,
                },
                {
                  x: 49,
                  y: 196.5,
                },
                {
                  x: 36,
                  y: 155.5,
                },
                {
                  x: 35,
                  y: 120.5,
                },
                {
                  x: 41,
                  y: 89.5,
                },
                {
                  x: 43,
                  y: 75.5,
                },
                {
                  x: 47,
                  y: 47.5,
                },
                {
                  x: 59,
                  y: 33.5,
                },
                {
                  x: 76,
                  y: 43.5,
                },
                {
                  x: 80,
                  y: 58.5,
                },
                {
                  x: 100,
                  y: 60.5,
                },
                {
                  x: 121,
                  y: 62.5,
                },
                {
                  x: 131,
                  y: 64.5,
                },
                {
                  x: 151,
                  y: 50.5,
                },
                {
                  x: 160,
                  y: 52.5,
                },
                {
                  x: 162,
                  y: 62.5,
                },
                {
                  x: 162,
                  y: 78.5,
                },
                {
                  x: 156,
                  y: 92.5,
                },
                {
                  x: 155,
                  y: 103.5,
                },
                {
                  x: 157,
                  y: 117.5,
                },
                {
                  x: 164,
                  y: 132.5,
                },
                {
                  x: 177,
                  y: 133.5,
                },
                {
                  x: 189,
                  y: 131.5,
                },
                {
                  x: 204,
                  y: 135.5,
                },
                {
                  x: 228,
                  y: 140.5,
                },
                {
                  x: 258,
                  y: 141.5,
                },
                {
                  x: 288,
                  y: 141.5,
                },
                {
                  x: 308,
                  y: 144.5,
                },
                {
                  x: 311,
                  y: 126.5,
                },
                {
                  x: 322,
                  y: 112.5,
                },
                {
                  x: 332,
                  y: 109.5,
                },
                {
                  x: 349,
                  y: 108.5,
                },
                {
                  x: 372,
                  y: 116.5,
                },
                {
                  x: 395,
                  y: 126.5,
                },
                {
                  x: 402,
                  y: 136.5,
                },
                {
                  x: 412,
                  y: 151.5,
                },
                {
                  x: 413,
                  y: 166.5,
                },
                {
                  x: 419,
                  y: 189.5,
                },
                {
                  x: 426,
                  y: 203.5,
                },
                {
                  x: 440,
                  y: 216.5,
                },
                {
                  x: 446,
                  y: 236.5,
                },
                {
                  x: 446,
                  y: 248.5,
                },
                {
                  x: 436,
                  y: 282.5,
                },
                {
                  x: 437,
                  y: 294.5,
                },
                {
                  x: 442,
                  y: 319.5,
                },
                {
                  x: 448,
                  y: 338.5,
                },
                {
                  x: 463,
                  y: 357.5,
                },
                {
                  x: 462,
                  y: 370.5,
                },
                {
                  x: 471,
                  y: 397.5,
                },
                {
                  x: 474,
                  y: 415.5,
                },
                {
                  x: 472,
                  y: 436.5,
                },
                {
                  x: 464,
                  y: 437.5,
                },
                {
                  x: 439,
                  y: 438.5,
                },
                {
                  x: 436,
                  y: 432.5,
                },
                {
                  x: 440,
                  y: 418.5,
                },
                {
                  x: 422,
                  y: 415.5,
                },
                {
                  x: 421,
                  y: 404.5,
                },
                {
                  x: 428,
                  y: 396.5,
                },
                {
                  x: 429,
                  y: 382.5,
                },
                {
                  x: 415,
                  y: 364.5,
                },
                {
                  x: 402,
                  y: 349.5,
                },
                {
                  x: 372,
                  y: 324.5,
                },
                {
                  x: 353,
                  y: 295.5,
                },
                {
                  x: 342,
                  y: 272.5,
                },
                {
                  x: 334,
                  y: 279.5,
                },
                {
                  x: 314,
                  y: 278.5,
                },
                {
                  x: 297,
                  y: 269.5,
                },
                {
                  x: 257,
                  y: 269.5,
                },
                {
                  x: 238,
                  y: 283.5,
                },
                {
                  x: 192,
                  y: 297.5,
                },
                {
                  x: 174,
                  y: 302.5,
                },
                {
                  x: 171,
                  y: 324.5,
                },
                {
                  x: 161,
                  y: 364.5,
                },
                {
                  x: 155,
                  y: 397.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-904b-760b-ae27-0cb5572d25dd.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 197,
                  y: 571.5,
                },
                {
                  x: 686,
                  y: 574.5,
                },
                {
                  x: 684,
                  y: 596.5,
                },
                {
                  x: 685,
                  y: 625.5,
                },
                {
                  x: 695,
                  y: 618.5,
                },
                {
                  x: 702,
                  y: 628.5,
                },
                {
                  x: 699,
                  y: 649.5,
                },
                {
                  x: 696,
                  y: 675.5,
                },
                {
                  x: 699,
                  y: 700.5,
                },
                {
                  x: 724,
                  y: 717.5,
                },
                {
                  x: 729,
                  y: 727.5,
                },
                {
                  x: 754,
                  y: 745.5,
                },
                {
                  x: 792,
                  y: 748.5,
                },
                {
                  x: 816,
                  y: 733.5,
                },
                {
                  x: 817,
                  y: 724.5,
                },
                {
                  x: 838,
                  y: 715.5,
                },
                {
                  x: 835,
                  y: 683.5,
                },
                {
                  x: 823,
                  y: 631.5,
                },
                {
                  x: 816,
                  y: 595.5,
                },
                {
                  x: 819,
                  y: 577.5,
                },
                {
                  x: 820,
                  y: 549.5,
                },
                {
                  x: 813,
                  y: 532.5,
                },
                {
                  x: 795,
                  y: 513.5,
                },
                {
                  x: 774,
                  y: 487.5,
                },
                {
                  x: 748,
                  y: 473.5,
                },
                {
                  x: 718,
                  y: 468.5,
                },
                {
                  x: 703,
                  y: 446.5,
                },
                {
                  x: 690,
                  y: 427.5,
                },
                {
                  x: 676,
                  y: 407.5,
                },
                {
                  x: 667,
                  y: 386.5,
                },
                {
                  x: 663,
                  y: 351.5,
                },
                {
                  x: 668,
                  y: 323.5,
                },
                {
                  x: 671,
                  y: 307.5,
                },
                {
                  x: 668,
                  y: 291.5,
                },
                {
                  x: 657,
                  y: 265.5,
                },
                {
                  x: 659,
                  y: 266.5,
                },
                {
                  x: 643,
                  y: 235.5,
                },
                {
                  x: 635,
                  y: 218.5,
                },
                {
                  x: 618,
                  y: 183.5,
                },
                {
                  x: 613,
                  y: 168.5,
                },
                {
                  x: 621,
                  y: 155.5,
                },
                {
                  x: 622,
                  y: 122.5,
                },
                {
                  x: 623,
                  y: 92.5,
                },
                {
                  x: 620,
                  y: 69.5,
                },
                {
                  x: 612,
                  y: 48.5,
                },
                {
                  x: 598,
                  y: 42.5,
                },
                {
                  x: 574,
                  y: 43.5,
                },
                {
                  x: 548,
                  y: 46.5,
                },
                {
                  x: 526,
                  y: 54.5,
                },
                {
                  x: 501,
                  y: 61.5,
                },
                {
                  x: 481,
                  y: 60.5,
                },
                {
                  x: 449,
                  y: 62.5,
                },
                {
                  x: 428,
                  y: 74.5,
                },
                {
                  x: 401,
                  y: 89.5,
                },
                {
                  x: 364,
                  y: 97.5,
                },
                {
                  x: 333,
                  y: 103.5,
                },
                {
                  x: 301,
                  y: 106.5,
                },
                {
                  x: 268,
                  y: 109.5,
                },
                {
                  x: 251,
                  y: 101.5,
                },
                {
                  x: 223,
                  y: 98.5,
                },
                {
                  x: 186,
                  y: 103.5,
                },
                {
                  x: 152,
                  y: 111.5,
                },
                {
                  x: 125,
                  y: 122.5,
                },
                {
                  x: 123,
                  y: 133.5,
                },
                {
                  x: 125,
                  y: 151.5,
                },
                {
                  x: 129,
                  y: 170.5,
                },
                {
                  x: 144,
                  y: 205.5,
                },
                {
                  x: 161,
                  y: 233.5,
                },
                {
                  x: 182,
                  y: 262.5,
                },
                {
                  x: 199,
                  y: 279.5,
                },
                {
                  x: 205,
                  y: 305.5,
                },
                {
                  x: 203,
                  y: 324.5,
                },
                {
                  x: 201,
                  y: 363.5,
                },
                {
                  x: 202,
                  y: 388.5,
                },
                {
                  x: 205,
                  y: 426.5,
                },
                {
                  x: 213,
                  y: 445.5,
                },
                {
                  x: 221,
                  y: 476.5,
                },
                {
                  x: 219,
                  y: 506.5,
                },
                {
                  x: 211,
                  y: 531.5,
                },
              ],
            },
            {
              label: "Cat",
              points: [
                {
                  x: 848,
                  y: 570.5,
                },
                {
                  x: 852,
                  y: 554.5,
                },
                {
                  x: 864,
                  y: 532.5,
                },
                {
                  x: 880,
                  y: 502.5,
                },
                {
                  x: 891,
                  y: 476.5,
                },
                {
                  x: 902,
                  y: 445.5,
                },
                {
                  x: 911,
                  y: 423.5,
                },
                {
                  x: 923,
                  y: 398.5,
                },
                {
                  x: 925,
                  y: 384.5,
                },
                {
                  x: 918,
                  y: 372.5,
                },
                {
                  x: 910,
                  y: 359.5,
                },
                {
                  x: 901,
                  y: 343.5,
                },
                {
                  x: 894,
                  y: 321.5,
                },
                {
                  x: 890,
                  y: 302.5,
                },
                {
                  x: 888,
                  y: 278.5,
                },
                {
                  x: 888,
                  y: 260.5,
                },
                {
                  x: 887,
                  y: 243.5,
                },
                {
                  x: 881,
                  y: 231.5,
                },
                {
                  x: 874,
                  y: 222.5,
                },
                {
                  x: 860,
                  y: 205.5,
                },
                {
                  x: 857,
                  y: 194.5,
                },
                {
                  x: 853,
                  y: 179.5,
                },
                {
                  x: 852,
                  y: 169.5,
                },
                {
                  x: 855,
                  y: 158.5,
                },
                {
                  x: 865,
                  y: 152.5,
                },
                {
                  x: 880,
                  y: 152.5,
                },
                {
                  x: 902,
                  y: 162.5,
                },
                {
                  x: 918,
                  y: 168.5,
                },
                {
                  x: 940,
                  y: 181.5,
                },
                {
                  x: 973,
                  y: 177.5,
                },
                {
                  x: 1004,
                  y: 170.5,
                },
                {
                  x: 1032,
                  y: 159.5,
                },
                {
                  x: 1048,
                  y: 136.5,
                },
                {
                  x: 1062,
                  y: 117.5,
                },
                {
                  x: 1069,
                  y: 107.5,
                },
                {
                  x: 1087,
                  y: 94.5,
                },
                {
                  x: 1110,
                  y: 95.5,
                },
                {
                  x: 1110,
                  y: 119.5,
                },
                {
                  x: 1112,
                  y: 148.5,
                },
                {
                  x: 1106,
                  y: 173.5,
                },
                {
                  x: 1107,
                  y: 197.5,
                },
                {
                  x: 1115,
                  y: 208.5,
                },
                {
                  x: 1128,
                  y: 219.5,
                },
                {
                  x: 1137,
                  y: 243.5,
                },
                {
                  x: 1139,
                  y: 268.5,
                },
                {
                  x: 1143,
                  y: 287.5,
                },
                {
                  x: 1151,
                  y: 311.5,
                },
                {
                  x: 1157,
                  y: 333.5,
                },
                {
                  x: 1173,
                  y: 353.5,
                },
                {
                  x: 1196,
                  y: 374.5,
                },
                {
                  x: 1210,
                  y: 386.5,
                },
                {
                  x: 1228,
                  y: 414.5,
                },
                {
                  x: 1236,
                  y: 438.5,
                },
                {
                  x: 1247,
                  y: 459.5,
                },
                {
                  x: 1259,
                  y: 488.5,
                },
                {
                  x: 1271,
                  y: 501.5,
                },
                {
                  x: 1302,
                  y: 501.5,
                },
                {
                  x: 1323,
                  y: 503.5,
                },
                {
                  x: 1336,
                  y: 518.5,
                },
                {
                  x: 1347,
                  y: 530.5,
                },
                {
                  x: 1359,
                  y: 548.5,
                },
                {
                  x: 1363,
                  y: 565.5,
                },
                {
                  x: 1367,
                  y: 590.5,
                },
                {
                  x: 1368,
                  y: 619.5,
                },
                {
                  x: 1365,
                  y: 656.5,
                },
                {
                  x: 1362,
                  y: 677.5,
                },
                {
                  x: 1347,
                  y: 693.5,
                },
                {
                  x: 1339,
                  y: 701.5,
                },
                {
                  x: 1315,
                  y: 696.5,
                },
                {
                  x: 1294,
                  y: 673.5,
                },
                {
                  x: 1287,
                  y: 655.5,
                },
                {
                  x: 1277,
                  y: 623.5,
                },
                {
                  x: 1275,
                  y: 604.5,
                },
                {
                  x: 1269,
                  y: 582.5,
                },
                {
                  x: 1245,
                  y: 573.5,
                },
                {
                  x: 1224,
                  y: 573.5,
                },
                {
                  x: 1106,
                  y: 574.5,
                },
                {
                  x: 1116,
                  y: 586.5,
                },
                {
                  x: 1128,
                  y: 605.5,
                },
                {
                  x: 1132,
                  y: 623.5,
                },
                {
                  x: 1137,
                  y: 652.5,
                },
                {
                  x: 1136,
                  y: 673.5,
                },
                {
                  x: 1121,
                  y: 688.5,
                },
                {
                  x: 1095,
                  y: 688.5,
                },
                {
                  x: 1081,
                  y: 682.5,
                },
                {
                  x: 1071,
                  y: 669.5,
                },
                {
                  x: 1059,
                  y: 641.5,
                },
                {
                  x: 1054,
                  y: 630.5,
                },
                {
                  x: 1046,
                  y: 619.5,
                },
                {
                  x: 1029,
                  y: 613.5,
                },
                {
                  x: 1001,
                  y: 588.5,
                },
                {
                  x: 981,
                  y: 576.5,
                },
                {
                  x: 969,
                  y: 574.5,
                },
                {
                  x: 941,
                  y: 573.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-90c5-73c9-a91a-a20e4741a5ee.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 1890.6976744186047,
                  y: 1076.7441860465117,
                },
                {
                  x: 1927.906976744186,
                  y: 1111.6279069767443,
                },
                {
                  x: 1934.8837209302326,
                  y: 1179.0697674418604,
                },
                {
                  x: 1927.906976744186,
                  y: 1258.139534883721,
                },
                {
                  x: 1902.3255813953488,
                  y: 1281.3953488372092,
                },
                {
                  x: 1879.0697674418604,
                  y: 1344.1860465116279,
                },
                {
                  x: 1867.4418604651164,
                  y: 1416.2790697674418,
                },
                {
                  x: 1865.1162790697674,
                  y: 1472.093023255814,
                },
                {
                  x: 1862.7906976744187,
                  y: 1518.6046511627908,
                },
                {
                  x: 1872.093023255814,
                  y: 1560.46511627907,
                },
                {
                  x: 1897.6744186046512,
                  y: 1600,
                },
                {
                  x: 1934.8837209302326,
                  y: 1606.9767441860465,
                },
                {
                  x: 1969.7674418604652,
                  y: 1593.0232558139535,
                },
                {
                  x: 1974.418604651163,
                  y: 1574.418604651163,
                },
                {
                  x: 1974.418604651163,
                  y: 1530.2325581395348,
                },
                {
                  x: 1972.093023255814,
                  y: 1495.3488372093022,
                },
                {
                  x: 1960.46511627907,
                  y: 1486.046511627907,
                },
                {
                  x: 1958.139534883721,
                  y: 1423.2558139534883,
                },
                {
                  x: 1972.093023255814,
                  y: 1388.3720930232557,
                },
                {
                  x: 2004.6511627906978,
                  y: 1365.1162790697674,
                },
                {
                  x: 2062.7906976744184,
                  y: 1325.5813953488373,
                },
                {
                  x: 2113.953488372093,
                  y: 1316.2790697674418,
                },
                {
                  x: 2167.4418604651164,
                  y: 1269.7674418604652,
                },
                {
                  x: 2188.3720930232557,
                  y: 1309.3023255813953,
                },
                {
                  x: 2206.9767441860467,
                  y: 1362.7906976744187,
                },
                {
                  x: 2218.6046511627906,
                  y: 1413.953488372093,
                },
                {
                  x: 2227.906976744186,
                  y: 1476.7441860465117,
                },
                {
                  x: 2232.5581395348836,
                  y: 1525.5813953488373,
                },
                {
                  x: 2232.5581395348836,
                  y: 1574.418604651163,
                },
                {
                  x: 2223.2558139534885,
                  y: 1618.6046511627908,
                },
                {
                  x: 2237.2093023255816,
                  y: 1644.1860465116279,
                },
                {
                  x: 2265.1162790697676,
                  y: 1653.4883720930234,
                },
                {
                  x: 2318.6046511627906,
                  y: 1658.139534883721,
                },
                {
                  x: 2362.7906976744184,
                  y: 1660.46511627907,
                },
                {
                  x: 2355.813953488372,
                  y: 1639.5348837209303,
                },
                {
                  x: 2341.860465116279,
                  y: 1604.6511627906978,
                },
                {
                  x: 2346.5116279069766,
                  y: 1560.46511627907,
                },
                {
                  x: 2348.8372093023254,
                  y: 1495.3488372093022,
                },
                {
                  x: 2360.4651162790697,
                  y: 1434.8837209302326,
                },
                {
                  x: 2369.767441860465,
                  y: 1439.5348837209303,
                },
                {
                  x: 2383.720930232558,
                  y: 1444.1860465116279,
                },
                {
                  x: 2411.6279069767443,
                  y: 1448.8372093023256,
                },
                {
                  x: 2420.93023255814,
                  y: 1430.2325581395348,
                },
                {
                  x: 2404.6511627906975,
                  y: 1386.046511627907,
                },
                {
                  x: 2400,
                  y: 1353.4883720930234,
                },
                {
                  x: 2400,
                  y: 1297.6744186046512,
                },
                {
                  x: 2409.3023255813955,
                  y: 1255.8139534883721,
                },
                {
                  x: 2432.5581395348836,
                  y: 1211.6279069767443,
                },
                {
                  x: 2437.2093023255816,
                  y: 1155.8139534883721,
                },
                {
                  x: 2451.1627906976746,
                  y: 1081.3953488372092,
                },
                {
                  x: 2451.1627906976746,
                  y: 983.7209302325582,
                },
                {
                  x: 2453.4883720930234,
                  y: 913.953488372093,
                },
                {
                  x: 2434.883720930233,
                  y: 858.1395348837209,
                },
                {
                  x: 2411.6279069767443,
                  y: 830.232558139535,
                },
                {
                  x: 2365.1162790697676,
                  y: 781.3953488372093,
                },
                {
                  x: 2306.9767441860467,
                  y: 753.4883720930233,
                },
                {
                  x: 2290.6976744186045,
                  y: 748.8372093023256,
                },
                {
                  x: 2309.3023255813955,
                  y: 725.5813953488372,
                },
                {
                  x: 2341.860465116279,
                  y: 681.3953488372093,
                },
                {
                  x: 2348.8372093023254,
                  y: 639.5348837209302,
                },
                {
                  x: 2346.5116279069766,
                  y: 593.0232558139535,
                },
                {
                  x: 2332.5581395348836,
                  y: 565.1162790697674,
                },
                {
                  x: 2290.6976744186045,
                  y: 530.232558139535,
                },
                {
                  x: 2246.5116279069766,
                  y: 518.6046511627907,
                },
                {
                  x: 2209.3023255813955,
                  y: 527.9069767441861,
                },
                {
                  x: 2183.720930232558,
                  y: 544.1860465116279,
                },
                {
                  x: 2169.767441860465,
                  y: 576.7441860465117,
                },
                {
                  x: 2176.7441860465115,
                  y: 586.046511627907,
                },
                {
                  x: 2246.5116279069766,
                  y: 581.3953488372093,
                },
                {
                  x: 2267.4418604651164,
                  y: 609.3023255813954,
                },
                {
                  x: 2248.8372093023254,
                  y: 651.1627906976744,
                },
                {
                  x: 2223.2558139534885,
                  y: 690.6976744186046,
                },
                {
                  x: 2190.6976744186045,
                  y: 695.3488372093024,
                },
                {
                  x: 2151.1627906976746,
                  y: 693.0232558139535,
                },
                {
                  x: 2123.2558139534885,
                  y: 704.6511627906976,
                },
                {
                  x: 2069.767441860465,
                  y: 723.2558139534884,
                },
                {
                  x: 2000,
                  y: 732.5581395348837,
                },
                {
                  x: 1953.4883720930234,
                  y: 734.8837209302326,
                },
                {
                  x: 1937.2093023255813,
                  y: 723.2558139534884,
                },
                {
                  x: 1909.3023255813953,
                  y: 711.6279069767442,
                },
                {
                  x: 1883.7209302325582,
                  y: 695.3488372093024,
                },
                {
                  x: 1862.7906976744187,
                  y: 683.7209302325582,
                },
                {
                  x: 1834.8837209302326,
                  y: 683.7209302325582,
                },
                {
                  x: 1816.2790697674418,
                  y: 706.9767441860465,
                },
                {
                  x: 1818.6046511627908,
                  y: 727.9069767441861,
                },
                {
                  x: 1802.3255813953488,
                  y: 732.5581395348837,
                },
                {
                  x: 1772.093023255814,
                  y: 732.5581395348837,
                },
                {
                  x: 1711.6279069767443,
                  y: 723.2558139534884,
                },
                {
                  x: 1690.6976744186047,
                  y: 713.953488372093,
                },
                {
                  x: 1676.7441860465117,
                  y: 704.6511627906976,
                },
                {
                  x: 1653.4883720930234,
                  y: 695.3488372093024,
                },
                {
                  x: 1655.8139534883721,
                  y: 723.2558139534884,
                },
                {
                  x: 1716.2790697674418,
                  y: 741.8604651162791,
                },
                {
                  x: 1716.2790697674418,
                  y: 758.1395348837209,
                },
                {
                  x: 1720.9302325581396,
                  y: 788.3720930232558,
                },
                {
                  x: 1713.953488372093,
                  y: 809.3023255813954,
                },
                {
                  x: 1693.0232558139535,
                  y: 844.1860465116279,
                },
                {
                  x: 1662.7906976744187,
                  y: 881.3953488372093,
                },
                {
                  x: 1660.46511627907,
                  y: 920.9302325581396,
                },
                {
                  x: 1662.7906976744187,
                  y: 948.8372093023256,
                },
                {
                  x: 1672.093023255814,
                  y: 976.7441860465117,
                },
                {
                  x: 1665.1162790697674,
                  y: 997.6744186046511,
                },
                {
                  x: 1655.8139534883721,
                  y: 1032.5581395348838,
                },
                {
                  x: 1669.7674418604652,
                  y: 1048.8372093023256,
                },
                {
                  x: 1686.046511627907,
                  y: 1065.1162790697674,
                },
                {
                  x: 1709.3023255813953,
                  y: 1079.0697674418604,
                },
                {
                  x: 1720.9302325581396,
                  y: 1093.0232558139535,
                },
                {
                  x: 1746.5116279069769,
                  y: 1109.3023255813953,
                },
                {
                  x: 1746.5116279069769,
                  y: 1109.3023255813953,
                },
                {
                  x: 1783.7209302325582,
                  y: 1109.3023255813953,
                },
                {
                  x: 1809.3023255813953,
                  y: 1093.0232558139535,
                },
                {
                  x: 1848.8372093023256,
                  y: 1074.4186046511627,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 597.6744186046511,
                  y: 1211.6279069767443,
                },
                {
                  x: 625.5813953488372,
                  y: 1241.860465116279,
                },
                {
                  x: 676.7441860465117,
                  y: 1276.7441860465117,
                },
                {
                  x: 737.2093023255815,
                  y: 1286.046511627907,
                },
                {
                  x: 800,
                  y: 1302.3255813953488,
                },
                {
                  x: 867.4418604651163,
                  y: 1318.6046511627908,
                },
                {
                  x: 916.2790697674419,
                  y: 1327.906976744186,
                },
                {
                  x: 944.186046511628,
                  y: 1344.1860465116279,
                },
                {
                  x: 955.8139534883721,
                  y: 1367.4418604651164,
                },
                {
                  x: 981.3953488372093,
                  y: 1383.7209302325582,
                },
                {
                  x: 1055.8139534883721,
                  y: 1397.6744186046512,
                },
                {
                  x: 1067.4418604651164,
                  y: 1395.3488372093022,
                },
                {
                  x: 1127.906976744186,
                  y: 1402.3255813953488,
                },
                {
                  x: 1153.4883720930234,
                  y: 1411.6279069767443,
                },
                {
                  x: 1209.3023255813953,
                  y: 1427.906976744186,
                },
                {
                  x: 1293.0232558139535,
                  y: 1444.1860465116279,
                },
                {
                  x: 1334.8837209302326,
                  y: 1453.4883720930234,
                },
                {
                  x: 1406.9767441860465,
                  y: 1458.139534883721,
                },
                {
                  x: 1513.953488372093,
                  y: 1458.139534883721,
                },
                {
                  x: 1555.8139534883721,
                  y: 1462.7906976744187,
                },
                {
                  x: 1597.6744186046512,
                  y: 1465.1162790697674,
                },
                {
                  x: 1672.093023255814,
                  y: 1469.7674418604652,
                },
                {
                  x: 1706.9767441860465,
                  y: 1483.7209302325582,
                },
                {
                  x: 1758.139534883721,
                  y: 1511.6279069767443,
                },
                {
                  x: 1802.3255813953488,
                  y: 1518.6046511627908,
                },
                {
                  x: 1858.139534883721,
                  y: 1520.9302325581396,
                },
                {
                  x: 1858.139534883721,
                  y: 1451.1627906976744,
                },
                {
                  x: 1858.139534883721,
                  y: 1406.9767441860465,
                },
                {
                  x: 1860.46511627907,
                  y: 1351.1627906976744,
                },
                {
                  x: 1867.4418604651164,
                  y: 1337.2093023255813,
                },
                {
                  x: 1823.2558139534883,
                  y: 1306.9767441860465,
                },
                {
                  x: 1746.5116279069769,
                  y: 1293.0232558139535,
                },
                {
                  x: 1674.418604651163,
                  y: 1286.046511627907,
                },
                {
                  x: 1602.3255813953488,
                  y: 1281.3953488372092,
                },
                {
                  x: 1541.860465116279,
                  y: 1244.1860465116279,
                },
                {
                  x: 1537.2093023255813,
                  y: 1202.3255813953488,
                },
                {
                  x: 1539.5348837209303,
                  y: 1169.7674418604652,
                },
                {
                  x: 1530.2325581395348,
                  y: 1139.5348837209303,
                },
                {
                  x: 1527.906976744186,
                  y: 1113.953488372093,
                },
                {
                  x: 1541.860465116279,
                  y: 1076.7441860465117,
                },
                {
                  x: 1548.8372093023256,
                  y: 1051.1627906976744,
                },
                {
                  x: 1555.8139534883721,
                  y: 1020.9302325581396,
                },
                {
                  x: 1555.8139534883721,
                  y: 990.6976744186047,
                },
                {
                  x: 1558.139534883721,
                  y: 967.4418604651163,
                },
                {
                  x: 1560.46511627907,
                  y: 953.4883720930233,
                },
                {
                  x: 1572.093023255814,
                  y: 934.8837209302326,
                },
                {
                  x: 1588.3720930232557,
                  y: 909.3023255813954,
                },
                {
                  x: 1595.3488372093022,
                  y: 879.0697674418604,
                },
                {
                  x: 1597.6744186046512,
                  y: 832.5581395348837,
                },
                {
                  x: 1597.6744186046512,
                  y: 793.0232558139535,
                },
                {
                  x: 1613.953488372093,
                  y: 767.4418604651163,
                },
                {
                  x: 1625.5813953488373,
                  y: 753.4883720930233,
                },
                {
                  x: 1639.5348837209303,
                  y: 711.6279069767442,
                },
                {
                  x: 1644.1860465116279,
                  y: 679.0697674418604,
                },
                {
                  x: 1676.7441860465117,
                  y: 658.1395348837209,
                },
                {
                  x: 1702.3255813953488,
                  y: 613.953488372093,
                },
                {
                  x: 1737.2093023255813,
                  y: 572.0930232558139,
                },
                {
                  x: 1779.0697674418604,
                  y: 544.1860465116279,
                },
                {
                  x: 1811.6279069767443,
                  y: 511.6279069767442,
                },
                {
                  x: 1834.8837209302326,
                  y: 488.37209302325584,
                },
                {
                  x: 1846.5116279069769,
                  y: 455.8139534883721,
                },
                {
                  x: 1869.7674418604652,
                  y: 425.5813953488372,
                },
                {
                  x: 1879.0697674418604,
                  y: 406.9767441860465,
                },
                {
                  x: 1874.418604651163,
                  y: 393.0232558139535,
                },
                {
                  x: 1823.2558139534883,
                  y: 402.3255813953488,
                },
                {
                  x: 1774.418604651163,
                  y: 420.93023255813955,
                },
                {
                  x: 1718.6046511627908,
                  y: 434.8837209302326,
                },
                {
                  x: 1700,
                  y: 430.2325581395349,
                },
                {
                  x: 1662.7906976744187,
                  y: 430.2325581395349,
                },
                {
                  x: 1616.2790697674418,
                  y: 430.2325581395349,
                },
                {
                  x: 1595.3488372093022,
                  y: 434.8837209302326,
                },
                {
                  x: 1572.093023255814,
                  y: 420.93023255813955,
                },
                {
                  x: 1553.4883720930234,
                  y: 413.95348837209303,
                },
                {
                  x: 1532.5581395348838,
                  y: 404.6511627906977,
                },
                {
                  x: 1504.6511627906978,
                  y: 393.0232558139535,
                },
                {
                  x: 1481.3953488372092,
                  y: 386.04651162790697,
                },
                {
                  x: 1460.46511627907,
                  y: 381.3953488372093,
                },
                {
                  x: 1446.5116279069769,
                  y: 369.7674418604651,
                },
                {
                  x: 1423.2558139534883,
                  y: 334.8837209302326,
                },
                {
                  x: 1411.6279069767443,
                  y: 276.74418604651163,
                },
                {
                  x: 1393.0232558139535,
                  y: 232.55813953488374,
                },
                {
                  x: 1379.0697674418604,
                  y: 195.34883720930233,
                },
                {
                  x: 1365.1162790697674,
                  y: 162.7906976744186,
                },
                {
                  x: 1348.8372093023256,
                  y: 139.53488372093022,
                },
                {
                  x: 1332.5581395348838,
                  y: 141.86046511627907,
                },
                {
                  x: 1300,
                  y: 162.7906976744186,
                },
                {
                  x: 1290.6976744186047,
                  y: 179.06976744186048,
                },
                {
                  x: 1262.7906976744187,
                  y: 239.53488372093022,
                },
                {
                  x: 1234.8837209302326,
                  y: 286.04651162790697,
                },
                {
                  x: 1223.2558139534883,
                  y: 339.5348837209302,
                },
                {
                  x: 1195.3488372093022,
                  y: 402.3255813953488,
                },
                {
                  x: 1204.6511627906978,
                  y: 427.90697674418607,
                },
                {
                  x: 1216.2790697674418,
                  y: 455.8139534883721,
                },
                {
                  x: 1213.953488372093,
                  y: 483.72093023255815,
                },
                {
                  x: 1183.7209302325582,
                  y: 506.9767441860465,
                },
                {
                  x: 1167.4418604651164,
                  y: 532.5581395348837,
                },
                {
                  x: 1158.139534883721,
                  y: 560.4651162790698,
                },
                {
                  x: 1151.1627906976744,
                  y: 595.3488372093024,
                },
                {
                  x: 1153.4883720930234,
                  y: 609.3023255813954,
                },
                {
                  x: 1102.3255813953488,
                  y: 630.232558139535,
                },
                {
                  x: 1041.860465116279,
                  y: 651.1627906976744,
                },
                {
                  x: 1002.3255813953489,
                  y: 681.3953488372093,
                },
                {
                  x: 993.0232558139535,
                  y: 700,
                },
                {
                  x: 974.4186046511628,
                  y: 711.6279069767442,
                },
                {
                  x: 906.9767441860465,
                  y: 720.9302325581396,
                },
                {
                  x: 860.4651162790698,
                  y: 734.8837209302326,
                },
                {
                  x: 779.0697674418604,
                  y: 765.1162790697674,
                },
                {
                  x: 702.3255813953489,
                  y: 841.8604651162791,
                },
                {
                  x: 648.8372093023256,
                  y: 906.9767441860465,
                },
                {
                  x: 602.3255813953489,
                  y: 983.7209302325582,
                },
                {
                  x: 590.6976744186046,
                  y: 1023.2558139534884,
                },
                {
                  x: 597.6744186046511,
                  y: 1123.2558139534883,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-9202-7089-98e8-61fc424b3963.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 784.8869910606971,
                  y: 972.8325085762219,
                },
                {
                  x: 792.5792987530048,
                  y: 939.4991752428886,
                },
                {
                  x: 793.861350035056,
                  y: 904.883790627504,
                },
                {
                  x: 792.5792987530048,
                  y: 876.6786624223757,
                },
                {
                  x: 779.758785932492,
                  y: 843.3453290890425,
                },
                {
                  x: 772.0664782401843,
                  y: 815.1402008839142,
                },
                {
                  x: 769.5023756760817,
                  y: 783.0889188326322,
                },
                {
                  x: 769.5023756760817,
                  y: 744.6273803710938,
                },
                {
                  x: 773.3485295222356,
                  y: 724.1145598582732,
                },
                {
                  x: 779.758785932492,
                  y: 701.0376367813501,
                },
                {
                  x: 790.0151961889022,
                  y: 662.5760983198116,
                },
                {
                  x: 798.9895551632612,
                  y: 653.6017393454528,
                },
                {
                  x: 788.733144906851,
                  y: 624.1145598582732,
                },
                {
                  x: 781.0408372145432,
                  y: 599.7555854992988,
                },
                {
                  x: 775.9126320863381,
                  y: 570.2684060121194,
                },
                {
                  x: 777.1946833683894,
                  y: 544.6273803710938,
                },
                {
                  x: 781.0408372145432,
                  y: 517.7043034480168,
                },
                {
                  x: 791.2972474709535,
                  y: 488.21712396083734,
                },
                {
                  x: 800.2716064453125,
                  y: 472.8325085762219,
                },
                {
                  x: 795.1434013171073,
                  y: 442.06327780699115,
                },
                {
                  x: 792.5792987530048,
                  y: 412.5760983198117,
                },
                {
                  x: 791.2972474709535,
                  y: 386.93507267878607,
                },
                {
                  x: 786.1690423427484,
                  y: 349.7555854992989,
                },
                {
                  x: 790.0151961889022,
                  y: 307.44789319160657,
                },
                {
                  x: 801.5536577273638,
                  y: 302.31968806340143,
                },
                {
                  x: 828.4767346504407,
                  y: 304.88379062750397,
                },
                {
                  x: 845.1434013171073,
                  y: 321.55045729417066,
                },
                {
                  x: 863.0921192658253,
                  y: 338.21712396083734,
                },
                {
                  x: 883.6049397786458,
                  y: 363.858149601863,
                },
                {
                  x: 897.70750388121,
                  y: 376.6786624223758,
                },
                {
                  x: 907.9639141376201,
                  y: 383.0889188326322,
                },
                {
                  x: 943.861350035056,
                  y: 383.0889188326322,
                },
                {
                  x: 1002.835709009415,
                  y: 380.52481626852966,
                },
                {
                  x: 1046.4254525991587,
                  y: 383.0889188326322,
                },
                {
                  x: 1065.6562218299277,
                  y: 370.2684060121194,
                },
                {
                  x: 1087.4510936247996,
                  y: 352.31968806340143,
                },
                {
                  x: 1105.3998115735176,
                  y: 333.0889188326322,
                },
                {
                  x: 1122.0664782401843,
                  y: 316.4222521659655,
                },
                {
                  x: 1147.70750388121,
                  y: 303.6017393454527,
                },
                {
                  x: 1164.3741705478765,
                  y: 303.6017393454527,
                },
                {
                  x: 1163.0921192658252,
                  y: 327.96071370442706,
                },
                {
                  x: 1160.5280167017227,
                  y: 365.14020088391425,
                },
                {
                  x: 1148.9895551632612,
                  y: 412.5760983198117,
                },
                {
                  x: 1145.1434013171074,
                  y: 442.06327780699115,
                },
                {
                  x: 1142.5792987530049,
                  y: 468.9863547300681,
                },
                {
                  x: 1159.2459654196714,
                  y: 499.7555854992989,
                },
                {
                  x: 1169.5023756760818,
                  y: 522.8325085762219,
                },
                {
                  x: 1170.784426958133,
                  y: 554.883790627504,
                },
                {
                  x: 1165.6562218299277,
                  y: 593.3453290890425,
                },
                {
                  x: 1161.810067983774,
                  y: 631.8068675505809,
                },
                {
                  x: 1172.0664782401843,
                  y: 667.7043034480168,
                },
                {
                  x: 1186.1690423427483,
                  y: 710.0119957557091,
                },
                {
                  x: 1188.7331449068508,
                  y: 740.7812265249398,
                },
                {
                  x: 1202.835709009415,
                  y: 756.1658419095553,
                },
                {
                  x: 1222.0664782401843,
                  y: 777.960713704427,
                },
                {
                  x: 1237.4510936247996,
                  y: 802.3196880634014,
                },
                {
                  x: 1257.9639141376201,
                  y: 827.960713704427,
                },
                {
                  x: 1269.5023756760818,
                  y: 848.4735342172476,
                },
                {
                  x: 1281.0408372145432,
                  y: 884.3709701146835,
                },
                {
                  x: 1293.8613500350561,
                  y: 922.8325085762219,
                },
                {
                  x: 1297.70750388121,
                  y: 940.7812265249398,
                },
                {
                  x: 1301.5536577273638,
                  y: 975.3966111403245,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 154.11776029146634,
                  y: 972.8325085762219,
                },
                {
                  x: 156.6818628555689,
                  y: 933.0889188326322,
                },
                {
                  x: 163.09211926582532,
                  y: 894.6273803710938,
                },
                {
                  x: 174.63058080428686,
                  y: 853.6017393454526,
                },
                {
                  x: 190.01519618890222,
                  y: 811.2940470377604,
                },
                {
                  x: 206.6818628555689,
                  y: 767.7043034480168,
                },
                {
                  x: 220.784426958133,
                  y: 730.5248162685297,
                },
                {
                  x: 236.16904234274838,
                  y: 694.6273803710938,
                },
                {
                  x: 231.04083721454327,
                  y: 666.4222521659656,
                },
                {
                  x: 232.32288849659454,
                  y: 656.1658419095553,
                },
                {
                  x: 246.42545259915863,
                  y: 644.6273803710938,
                },
                {
                  x: 261.81006798377405,
                  y: 621.5504572941707,
                },
                {
                  x: 270.784426958133,
                  y: 597.1914829351963,
                },
                {
                  x: 279.758785932492,
                  y: 575.3966111403245,
                },
                {
                  x: 295.14340131710736,
                  y: 565.1402008839142,
                },
                {
                  x: 290.0151961889022,
                  y: 527.9607137044271,
                },
                {
                  x: 283.6049397786458,
                  y: 510.0119957557091,
                },
                {
                  x: 281.0408372145433,
                  y: 486.935072678786,
                },
                {
                  x: 287.4510936247997,
                  y: 463.858149601863,
                },
                {
                  x: 296.42545259915863,
                  y: 422.8325085762219,
                },
                {
                  x: 304.1177602914663,
                  y: 407.44789319160657,
                },
                {
                  x: 309.24596541967145,
                  y: 386.93507267878607,
                },
                {
                  x: 311.81006798377405,
                  y: 357.44789319160657,
                },
                {
                  x: 311.81006798377405,
                  y: 343.3453290890425,
                },
                {
                  x: 319.5023756760817,
                  y: 317.70430344801684,
                },
                {
                  x: 324.63058080428686,
                  y: 290.7812265249399,
                },
                {
                  x: 318.22032439403046,
                  y: 274.11455985827325,
                },
                {
                  x: 313.0921192658253,
                  y: 249.75558549929886,
                },
                {
                  x: 306.6818628555689,
                  y: 229.24276498647836,
                },
                {
                  x: 310.5280167017227,
                  y: 210.01199575570914,
                },
                {
                  x: 316.93827311197913,
                  y: 189.4991752428886,
                },
                {
                  x: 329.758785932492,
                  y: 176.6786624223758,
                },
                {
                  x: 333.6049397786458,
                  y: 143.34532908904245,
                },
                {
                  x: 347.7075038812099,
                  y: 117.70430344801682,
                },
                {
                  x: 365.65622182992786,
                  y: 85.65302139673477,
                },
                {
                  x: 366.93827311197913,
                  y: 57.44789319160657,
                },
                {
                  x: 378.4767346504407,
                  y: 30.524816268529648,
                },
                {
                  x: 391.2972474709535,
                  y: 18.986354730068108,
                },
                {
                  x: 410.5280167017227,
                  y: 24.114559858273235,
                },
                {
                  x: 436.16904234274836,
                  y: 48.4735342172476,
                },
                {
                  x: 457.9639141376202,
                  y: 71.55045729417067,
                },
                {
                  x: 463.0921192658253,
                  y: 90.7812265249399,
                },
                {
                  x: 469.5023756760817,
                  y: 111.29404703776041,
                },
                {
                  x: 473.34852952223554,
                  y: 139.4991752428886,
                },
                {
                  x: 474.63058080428686,
                  y: 165.14020088391425,
                },
                {
                  x: 482.32288849659454,
                  y: 186.93507267878604,
                },
                {
                  x: 492.57929875300476,
                  y: 213.85814960186298,
                },
                {
                  x: 523.3485295222356,
                  y: 224.11455985827322,
                },
                {
                  x: 542.5792987530048,
                  y: 220.26840601211939,
                },
                {
                  x: 566.9382731119791,
                  y: 217.70430344801682,
                },
                {
                  x: 574.6305808042869,
                  y: 204.883790627504,
                },
                {
                  x: 578.4767346504407,
                  y: 181.80686755058093,
                },
                {
                  x: 587.4510936247997,
                  y: 139.4991752428886,
                },
                {
                  x: 601.5536577273638,
                  y: 106.16584190955528,
                },
                {
                  x: 623.3485295222356,
                  y: 74.11455985827324,
                },
                {
                  x: 642.5792987530048,
                  y: 56.16584190955528,
                },
                {
                  x: 673.3485295222356,
                  y: 42.06327780699119,
                },
                {
                  x: 690.0151961889022,
                  y: 60.01199575570913,
                },
                {
                  x: 698.9895551632612,
                  y: 86.93507267878606,
                },
                {
                  x: 705.3998115735176,
                  y: 133.0889188326322,
                },
                {
                  x: 714.3741705478766,
                  y: 158.72994447365784,
                },
                {
                  x: 722.0664782401843,
                  y: 176.6786624223758,
                },
                {
                  x: 724.6305808042869,
                  y: 201.03763678135016,
                },
                {
                  x: 731.0408372145432,
                  y: 225.39661114032452,
                },
                {
                  x: 745.1434013171073,
                  y: 238.21712396083734,
                },
                {
                  x: 748.9895551632612,
                  y: 266.4222521659655,
                },
                {
                  x: 737.4510936247997,
                  y: 288.21712396083734,
                },
                {
                  x: 725.9126320863381,
                  y: 301.03763678135016,
                },
                {
                  x: 727.1946833683894,
                  y: 329.24276498647833,
                },
                {
                  x: 736.1690423427484,
                  y: 376.6786624223758,
                },
                {
                  x: 733.6049397786458,
                  y: 412.5760983198117,
                },
                {
                  x: 736.1690423427484,
                  y: 456.1658419095553,
                },
                {
                  x: 740.0151961889022,
                  y: 494.62738037109375,
                },
                {
                  x: 732.3228884965945,
                  y: 531.8068675505809,
                },
                {
                  x: 716.9382731119791,
                  y: 574.1145598582732,
                },
                {
                  x: 704.1177602914663,
                  y: 610.0119957557091,
                },
                {
                  x: 696.4254525991586,
                  y: 643.3453290890425,
                },
                {
                  x: 705.3998115735176,
                  y: 654.883790627504,
                },
                {
                  x: 731.0408372145432,
                  y: 684.3709701146835,
                },
                {
                  x: 725.9126320863381,
                  y: 725.3966111403245,
                },
                {
                  x: 723.3485295222356,
                  y: 758.7299444736578,
                },
                {
                  x: 747.70750388121,
                  y: 806.1658419095553,
                },
                {
                  x: 757.9639141376201,
                  y: 852.3196880634014,
                },
                {
                  x: 765.6562218299279,
                  y: 890.7812265249398,
                },
                {
                  x: 766.9382731119791,
                  y: 920.2684060121194,
                },
                {
                  x: 768.2203243940304,
                  y: 943.3453290890425,
                },
                {
                  x: 770.7844269581329,
                  y: 974.1145598582732,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-9255-7580-a858-6a2b966fbf80.jpg",
        annotation: {
          annotation: [
            {
              label: "Dog",
              points: [
                {
                  x: 315,
                  y: 517.5,
                },
                {
                  x: 284,
                  y: 505.5,
                },
                {
                  x: 276,
                  y: 492.5,
                },
                {
                  x: 274,
                  y: 466.5,
                },
                {
                  x: 273,
                  y: 434.5,
                },
                {
                  x: 274,
                  y: 402.5,
                },
                {
                  x: 275,
                  y: 377.5,
                },
                {
                  x: 272,
                  y: 361.5,
                },
                {
                  x: 263,
                  y: 349.5,
                },
                {
                  x: 257,
                  y: 339.5,
                },
                {
                  x: 256,
                  y: 316.5,
                },
                {
                  x: 259,
                  y: 291.5,
                },
                {
                  x: 278,
                  y: 267.5,
                },
                {
                  x: 290,
                  y: 240.5,
                },
                {
                  x: 290,
                  y: 219.5,
                },
                {
                  x: 289,
                  y: 199.5,
                },
                {
                  x: 289,
                  y: 179.5,
                },
                {
                  x: 289,
                  y: 163.5,
                },
                {
                  x: 292,
                  y: 146.5,
                },
                {
                  x: 305,
                  y: 134.5,
                },
                {
                  x: 314,
                  y: 126.5,
                },
                {
                  x: 328,
                  y: 121.5,
                },
                {
                  x: 338,
                  y: 109.5,
                },
                {
                  x: 353,
                  y: 91.5,
                },
                {
                  x: 363,
                  y: 82.5,
                },
                {
                  x: 378,
                  y: 80.5,
                },
                {
                  x: 395,
                  y: 85.5,
                },
                {
                  x: 418,
                  y: 87.5,
                },
                {
                  x: 439,
                  y: 102.5,
                },
                {
                  x: 446,
                  y: 119.5,
                },
                {
                  x: 453,
                  y: 134.5,
                },
                {
                  x: 468,
                  y: 141.5,
                },
                {
                  x: 487,
                  y: 155.5,
                },
                {
                  x: 493,
                  y: 174.5,
                },
                {
                  x: 499,
                  y: 201.5,
                },
                {
                  x: 499,
                  y: 225.5,
                },
                {
                  x: 494,
                  y: 240.5,
                },
                {
                  x: 489,
                  y: 257.5,
                },
                {
                  x: 500,
                  y: 274.5,
                },
                {
                  x: 503,
                  y: 286.5,
                },
                {
                  x: 509,
                  y: 303.5,
                },
                {
                  x: 527,
                  y: 308.5,
                },
                {
                  x: 548,
                  y: 313.5,
                },
                {
                  x: 575,
                  y: 323.5,
                },
                {
                  x: 602,
                  y: 333.5,
                },
                {
                  x: 631,
                  y: 348.5,
                },
                {
                  x: 643,
                  y: 359.5,
                },
                {
                  x: 658,
                  y: 378.5,
                },
                {
                  x: 673,
                  y: 395.5,
                },
                {
                  x: 708,
                  y: 406.5,
                },
                {
                  x: 722,
                  y: 409.5,
                },
                {
                  x: 736,
                  y: 418.5,
                },
                {
                  x: 745,
                  y: 437.5,
                },
                {
                  x: 744,
                  y: 446.5,
                },
                {
                  x: 757,
                  y: 453.5,
                },
                {
                  x: 775,
                  y: 454.5,
                },
                {
                  x: 792,
                  y: 455.5,
                },
                {
                  x: 795,
                  y: 466.5,
                },
                {
                  x: 789,
                  y: 478.5,
                },
                {
                  x: 762,
                  y: 479.5,
                },
                {
                  x: 729,
                  y: 478.5,
                },
                {
                  x: 685,
                  y: 478.5,
                },
                {
                  x: 644,
                  y: 479.5,
                },
                {
                  x: 600,
                  y: 485.5,
                },
                {
                  x: 560,
                  y: 490.5,
                },
                {
                  x: 528,
                  y: 496.5,
                },
                {
                  x: 497,
                  y: 506.5,
                },
                {
                  x: 462,
                  y: 511.5,
                },
                {
                  x: 421,
                  y: 515.5,
                },
                {
                  x: 388,
                  y: 519.5,
                },
                {
                  x: 347,
                  y: 523.5,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/019689ae-92b7-7109-9745-ecca687f3440.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 465.2173913043478,
                  y: 1068.6902253524117,
                },
                {
                  x: 467.39130434782606,
                  y: 1014.3423992654551,
                },
                {
                  x: 467.39130434782606,
                  y: 975.2119644828464,
                },
                {
                  x: 450,
                  y: 931.7337036132812,
                },
                {
                  x: 436.95652173913044,
                  y: 899.1250079611073,
                },
                {
                  x: 430.4347826086956,
                  y: 838.255442743716,
                },
                {
                  x: 450,
                  y: 786.0815297002378,
                },
                {
                  x: 467.39130434782606,
                  y: 744.7771818741508,
                },
                {
                  x: 497.8260869565217,
                  y: 686.0815297002378,
                },
                {
                  x: 536.9565217391304,
                  y: 638.255442743716,
                },
                {
                  x: 593.4782608695652,
                  y: 614.3423992654551,
                },
                {
                  x: 641.3043478260869,
                  y: 596.951094917629,
                },
                {
                  x: 671.7391304347826,
                  y: 564.3423992654551,
                },
                {
                  x: 754.3478260869565,
                  y: 503.4728340480638,
                },
                {
                  x: 780.4347826086956,
                  y: 451.29892100458557,
                },
                {
                  x: 863.0434782608695,
                  y: 423.0380514393682,
                },
                {
                  x: 941.3043478260869,
                  y: 401.29892100458557,
                },
                {
                  x: 1039.1304347826087,
                  y: 388.255442743716,
                },
                {
                  x: 1134.782608695652,
                  y: 377.3858775263247,
                },
                {
                  x: 1197.8260869565217,
                  y: 392.60326883067256,
                },
                {
                  x: 1280.4347826086955,
                  y: 388.255442743716,
                },
                {
                  x: 1306.5217391304348,
                  y: 394.7771818741508,
                },
                {
                  x: 1297.8260869565217,
                  y: 373.0380514393682,
                },
                {
                  x: 1291.304347826087,
                  y: 351.29892100458557,
                },
                {
                  x: 1297.8260869565217,
                  y: 325.21196448284644,
                },
                {
                  x: 1328.2608695652173,
                  y: 333.9076166567595,
                },
                {
                  x: 1365.2173913043478,
                  y: 362.1684862219769,
                },
                {
                  x: 1384.782608695652,
                  y: 375.21196448284644,
                },
                {
                  x: 1415.2173913043478,
                  y: 383.9076166567595,
                },
                {
                  x: 1473.9130434782608,
                  y: 377.3858775263247,
                },
                {
                  x: 1543.4782608695652,
                  y: 368.6902253524117,
                },
                {
                  x: 1600,
                  y: 364.34239926545513,
                },
                {
                  x: 1645.6521739130435,
                  y: 362.1684862219769,
                },
                {
                  x: 1717.391304347826,
                  y: 355.6467470915421,
                },
                {
                  x: 1760.8695652173913,
                  y: 355.6467470915421,
                },
                {
                  x: 1806.5217391304348,
                  y: 353.4728340480638,
                },
                {
                  x: 1819.5652173913043,
                  y: 327.3858775263247,
                },
                {
                  x: 1841.3043478260868,
                  y: 299.1250079611073,
                },
                {
                  x: 1871.7391304347825,
                  y: 262.1684862219769,
                },
                {
                  x: 1891.3043478260868,
                  y: 246.95109491762906,
                },
                {
                  x: 1893.4782608695652,
                  y: 296.95109491762906,
                },
                {
                  x: 1895.6521739130435,
                  y: 331.73370361328125,
                },
                {
                  x: 1876.086956521739,
                  y: 379.559790569803,
                },
                {
                  x: 1876.086956521739,
                  y: 409.9945731784986,
                },
                {
                  x: 1880.4347826086955,
                  y: 442.60326883067256,
                },
                {
                  x: 1891.3043478260868,
                  y: 496.95109491762906,
                },
                {
                  x: 1910.8695652173913,
                  y: 525.2119644828465,
                },
                {
                  x: 1928.2608695652173,
                  y: 559.9945731784986,
                },
                {
                  x: 1932.6086956521738,
                  y: 596.951094917629,
                },
                {
                  x: 1932.6086956521738,
                  y: 651.2989210045856,
                },
                {
                  x: 1926.086956521739,
                  y: 692.6032688306725,
                },
                {
                  x: 1926.086956521739,
                  y: 731.7337036132812,
                },
                {
                  x: 1932.6086956521738,
                  y: 770.8641383958899,
                },
                {
                  x: 1952.1739130434783,
                  y: 820.8641383958899,
                },
                {
                  x: 1967.391304347826,
                  y: 864.3423992654551,
                },
                {
                  x: 1971.7391304347825,
                  y: 903.4728340480639,
                },
                {
                  x: 1969.5652173913043,
                  y: 942.6032688306725,
                },
                {
                  x: 1971.7391304347825,
                  y: 975.2119644828464,
                },
                {
                  x: 1997.8260869565217,
                  y: 999.1250079611073,
                },
                {
                  x: 2013.0434782608695,
                  y: 1029.559790569803,
                },
                {
                  x: 2023.9130434782608,
                  y: 1070.86413839589,
                },
                {
                  x: 2036.9565217391303,
                  y: 1120.86413839589,
                },
                {
                  x: 2039.1304347826085,
                  y: 1155.646747091542,
                },
                {
                  x: 2043.478260869565,
                  y: 1205.646747091542,
                },
                {
                  x: 2030.4347826086955,
                  y: 1264.342399265455,
                },
                {
                  x: 2010.8695652173913,
                  y: 1296.951094917629,
                },
                {
                  x: 1932.6086956521738,
                  y: 1336.0815297002378,
                },
                {
                  x: 1856.5217391304348,
                  y: 1377.3858775263247,
                },
                {
                  x: 1769.5652173913043,
                  y: 1381.7337036132812,
                },
                {
                  x: 1700,
                  y: 1388.255442743716,
                },
                {
                  x: 1632.6086956521738,
                  y: 1364.342399265455,
                },
                {
                  x: 1578.2608695652173,
                  y: 1366.5163123089333,
                },
                {
                  x: 1480.4347826086955,
                  y: 1370.86413839589,
                },
                {
                  x: 1384.782608695652,
                  y: 1349.1250079611073,
                },
                {
                  x: 1300,
                  y: 1327.3858775263247,
                },
                {
                  x: 1182.6086956521738,
                  y: 1292.6032688306725,
                },
                {
                  x: 1128.2608695652173,
                  y: 1270.86413839589,
                },
                {
                  x: 1032.6086956521738,
                  y: 1236.0815297002378,
                },
                {
                  x: 978.2608695652174,
                  y: 1179.559790569803,
                },
                {
                  x: 952.1739130434783,
                  y: 1162.1684862219768,
                },
                {
                  x: 873.9130434782609,
                  y: 1140.4293557871943,
                },
                {
                  x: 832.6086956521739,
                  y: 1136.0815297002378,
                },
                {
                  x: 817.391304347826,
                  y: 1116.5163123089333,
                },
                {
                  x: 767.391304347826,
                  y: 1131.7337036132812,
                },
                {
                  x: 734.7826086956521,
                  y: 1129.559790569803,
                },
                {
                  x: 680.4347826086956,
                  y: 1109.9945731784985,
                },
                {
                  x: 663.0434782608695,
                  y: 1105.646747091542,
                },
                {
                  x: 632.6086956521739,
                  y: 1116.5163123089333,
                },
                {
                  x: 617.391304347826,
                  y: 1116.5163123089333,
                },
                {
                  x: 591.3043478260869,
                  y: 1103.4728340480638,
                },
                {
                  x: 578.2608695652174,
                  y: 1112.1684862219768,
                },
                {
                  x: 571.7391304347826,
                  y: 1123.0380514393682,
                },
                {
                  x: 550,
                  y: 1120.86413839589,
                },
                {
                  x: 513.0434782608695,
                  y: 1105.646747091542,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
      {
        path: "datasets/segmentation/01968a3d-9ac9-728a-9033-999ed4fe9854.jpg",
        annotation: {
          annotation: [
            {
              label: "Cat",
              points: [
                {
                  x: 28,
                  y: 557,
                },
                {
                  x: 25,
                  y: 536,
                },
                {
                  x: 29,
                  y: 515,
                },
                {
                  x: 32,
                  y: 492,
                },
                {
                  x: 37,
                  y: 474,
                },
                {
                  x: 44,
                  y: 450,
                },
                {
                  x: 51,
                  y: 431,
                },
                {
                  x: 61,
                  y: 411,
                },
                {
                  x: 65,
                  y: 394,
                },
                {
                  x: 57,
                  y: 382,
                },
                {
                  x: 52,
                  y: 364,
                },
                {
                  x: 51,
                  y: 346,
                },
                {
                  x: 54,
                  y: 329,
                },
                {
                  x: 57,
                  y: 315,
                },
                {
                  x: 63,
                  y: 296,
                },
                {
                  x: 68,
                  y: 276,
                },
                {
                  x: 70,
                  y: 262,
                },
                {
                  x: 69,
                  y: 244,
                },
                {
                  x: 73,
                  y: 227,
                },
                {
                  x: 73,
                  y: 205,
                },
                {
                  x: 73,
                  y: 193,
                },
                {
                  x: 78,
                  y: 181,
                },
                {
                  x: 85,
                  y: 171,
                },
                {
                  x: 96,
                  y: 172,
                },
                {
                  x: 101,
                  y: 180,
                },
                {
                  x: 113,
                  y: 197,
                },
                {
                  x: 119,
                  y: 214,
                },
                {
                  x: 128,
                  y: 230,
                },
                {
                  x: 139,
                  y: 246,
                },
                {
                  x: 153,
                  y: 249,
                },
                {
                  x: 186,
                  y: 255,
                },
                {
                  x: 196,
                  y: 261,
                },
                {
                  x: 222,
                  y: 266,
                },
                {
                  x: 228,
                  y: 266,
                },
                {
                  x: 242,
                  y: 258,
                },
                {
                  x: 253,
                  y: 250,
                },
                {
                  x: 273,
                  y: 236,
                },
                {
                  x: 288,
                  y: 230,
                },
                {
                  x: 305,
                  y: 233,
                },
                {
                  x: 305,
                  y: 247,
                },
                {
                  x: 302,
                  y: 263,
                },
                {
                  x: 297,
                  y: 277,
                },
                {
                  x: 289,
                  y: 293,
                },
                {
                  x: 281,
                  y: 311,
                },
                {
                  x: 276,
                  y: 319,
                },
                {
                  x: 265,
                  y: 339,
                },
                {
                  x: 260,
                  y: 352,
                },
                {
                  x: 255,
                  y: 378,
                },
                {
                  x: 250,
                  y: 397,
                },
                {
                  x: 244,
                  y: 416,
                },
                {
                  x: 233,
                  y: 429,
                },
                {
                  x: 232,
                  y: 443,
                },
                {
                  x: 243,
                  y: 453,
                },
                {
                  x: 259,
                  y: 458,
                },
                {
                  x: 279,
                  y: 469,
                },
                {
                  x: 303,
                  y: 483,
                },
                {
                  x: 315,
                  y: 493,
                },
                {
                  x: 320,
                  y: 507,
                },
                {
                  x: 322,
                  y: 522,
                },
                {
                  x: 321,
                  y: 537,
                },
                {
                  x: 320,
                  y: 557,
                },
              ],
            },
            {
              label: "Dog",
              points: [
                {
                  x: 324,
                  y: 559,
                },
                {
                  x: 325,
                  y: 527,
                },
                {
                  x: 325,
                  y: 511,
                },
                {
                  x: 322,
                  y: 498,
                },
                {
                  x: 319,
                  y: 489,
                },
                {
                  x: 322,
                  y: 467,
                },
                {
                  x: 327,
                  y: 449,
                },
                {
                  x: 328,
                  y: 430,
                },
                {
                  x: 319,
                  y: 406,
                },
                {
                  x: 307,
                  y: 386,
                },
                {
                  x: 299,
                  y: 363,
                },
                {
                  x: 297,
                  y: 343,
                },
                {
                  x: 297,
                  y: 325,
                },
                {
                  x: 298,
                  y: 308,
                },
                {
                  x: 298,
                  y: 290,
                },
                {
                  x: 301,
                  y: 277,
                },
                {
                  x: 303,
                  y: 268,
                },
                {
                  x: 306,
                  y: 248,
                },
                {
                  x: 306,
                  y: 234,
                },
                {
                  x: 303,
                  y: 227,
                },
                {
                  x: 288,
                  y: 225,
                },
                {
                  x: 281,
                  y: 218,
                },
                {
                  x: 274,
                  y: 195,
                },
                {
                  x: 268,
                  y: 177,
                },
                {
                  x: 264,
                  y: 161,
                },
                {
                  x: 263,
                  y: 153,
                },
                {
                  x: 262,
                  y: 134,
                },
                {
                  x: 258,
                  y: 114,
                },
                {
                  x: 255,
                  y: 100,
                },
                {
                  x: 254,
                  y: 88,
                },
                {
                  x: 267,
                  y: 79,
                },
                {
                  x: 281,
                  y: 79,
                },
                {
                  x: 303,
                  y: 86,
                },
                {
                  x: 315,
                  y: 94,
                },
                {
                  x: 331,
                  y: 104,
                },
                {
                  x: 353,
                  y: 124,
                },
                {
                  x: 363,
                  y: 135,
                },
                {
                  x: 377,
                  y: 144,
                },
                {
                  x: 394,
                  y: 152,
                },
                {
                  x: 408,
                  y: 152,
                },
                {
                  x: 417,
                  y: 148,
                },
                {
                  x: 439,
                  y: 144,
                },
                {
                  x: 460,
                  y: 140,
                },
                {
                  x: 463,
                  y: 118,
                },
                {
                  x: 474,
                  y: 97,
                },
                {
                  x: 482,
                  y: 77,
                },
                {
                  x: 497,
                  y: 52,
                },
                {
                  x: 511,
                  y: 29,
                },
                {
                  x: 536,
                  y: 17,
                },
                {
                  x: 547,
                  y: 24,
                },
                {
                  x: 553,
                  y: 38,
                },
                {
                  x: 557,
                  y: 53,
                },
                {
                  x: 561,
                  y: 73,
                },
                {
                  x: 563,
                  y: 92,
                },
                {
                  x: 567,
                  y: 112,
                },
                {
                  x: 575,
                  y: 142,
                },
                {
                  x: 581,
                  y: 177,
                },
                {
                  x: 576,
                  y: 197,
                },
                {
                  x: 576,
                  y: 211,
                },
                {
                  x: 580,
                  y: 221,
                },
                {
                  x: 598,
                  y: 235,
                },
                {
                  x: 600,
                  y: 260,
                },
                {
                  x: 596,
                  y: 272,
                },
                {
                  x: 592,
                  y: 286,
                },
                {
                  x: 594,
                  y: 297,
                },
                {
                  x: 601,
                  y: 314,
                },
                {
                  x: 607,
                  y: 335,
                },
                {
                  x: 603,
                  y: 353,
                },
                {
                  x: 599,
                  y: 368,
                },
                {
                  x: 598,
                  y: 391,
                },
                {
                  x: 606,
                  y: 417,
                },
                {
                  x: 616,
                  y: 428,
                },
                {
                  x: 632,
                  y: 444,
                },
                {
                  x: 640,
                  y: 455,
                },
                {
                  x: 654,
                  y: 469,
                },
                {
                  x: 668,
                  y: 492,
                },
                {
                  x: 669,
                  y: 554,
                },
              ],
            },
          ],
        },
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      },
    ];

    await context.insert(user).values(sampleUsers);
    await context.insert(account).values(sampleAccounts);
    await context.insert(datasets).values(sampleDatasets);
    await context.insert(workflows).values(sampleWorkflows);
    await context.insert(images).values(sampleImages);
    logger.info("🌱 Auth data has been seeded");
    Promise.resolve();
  });
}

seedAuth()
  .catch((e): void => {
    logger.error(`Seeding error ${JSON.stringify(e)}`, e);
    process.exit(1);
  })
  .finally((): void => {
    logger.info("Seeding done!");
    process.exit(0);
  });
