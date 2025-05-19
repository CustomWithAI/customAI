import { config } from "@/config/env";
import { logger } from "@/config/logger";
import { account, user } from "@/domains/schema/auth";
import { datasets } from "@/domains/schema/datasets";
import { images } from "@/domains/schema/images";
import { workflows } from "@/domains/schema/workflows";
import { randomUUIDv7 } from "bun";
import { drizzle } from "drizzle-orm/node-postgres";
import classificationOneData from "@/infrastructures/database/seed-data/classification-1.json";
import classificationTwoData from "@/infrastructures/database/seed-data/classification-2.json";
import objectDetectionData from "@/infrastructures/database/seed-data/object-detection.json";
import segmentationData from "@/infrastructures/database/seed-data/segmentation.json";

const db = drizzle(
  `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_LOCAL_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`
);

export async function seedData(): Promise<void> {
  logger.info("🌱 Seeding data...");
  await db.transaction(async (context) => {
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

    const classificationDatasetOneId = randomUUIDv7();
    const classificationDatasetTwoId = randomUUIDv7();
    const objectDetectionDatasetId = randomUUIDv7();
    const segmentationDatasetId = randomUUIDv7();
    const classificationWorkflowId = randomUUIDv7();
    const objectDetectionWorkflowId = randomUUIDv7();
    const segmentationWorkflowId = randomUUIDv7();
    const now = new Date();

    const sampleDatasets = [
      {
        id: classificationDatasetOneId,
        name: "Classification Sample Dataset 1",
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
        id: classificationDatasetTwoId,
        name: "Classification Sample Dataset 2",
        description: "Dog and Cat Dataset For Classification Training",
        annotationMethod: "classification",
        splitMethod: "default",
        labels: [
          {
            name: "Cat",
            color: "#15a0f4",
          },
          {
            name: "Dog",
            color: "#d833f0",
          },
        ],
        train: 80,
        test: 10,
        valid: 10,
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

    const classificationOneImages = classificationOneData.map((data) => {
      return {
        ...data,
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetOneId,
      };
    });

    const classificationTwoImages = classificationTwoData.map((data) => {
      return {
        ...data,
        createdAt: now,
        updatedAt: now,
        datasetId: classificationDatasetTwoId,
      };
    });

    const objectDetectionImages = objectDetectionData.map((data) => {
      return {
        ...data,
        createdAt: now,
        updatedAt: now,
        datasetId: objectDetectionDatasetId,
      };
    });

    const segmentationImages = segmentationData.map((data) => {
      return {
        ...data,
        createdAt: now,
        updatedAt: now,
        datasetId: segmentationDatasetId,
      };
    });

    await context.insert(user).values(sampleUsers);
    await context.insert(account).values(sampleAccounts);
    await context.insert(datasets).values(sampleDatasets);
    await context.insert(workflows).values(sampleWorkflows);
    await context.insert(images).values(classificationOneImages);
    await context.insert(images).values(classificationTwoImages);
    await context.insert(images).values(objectDetectionImages);
    await context.insert(images).values(segmentationImages);
    logger.info("🌱 Data has been seeded");
    Promise.resolve();
  });
}

seedData()
  .catch((e): void => {
    logger.error(`Seeding error ${JSON.stringify(e)}`, e);
    process.exit(1);
  })
  .finally((): void => {
    logger.info("Seeding done!");
    process.exit(0);
  });
