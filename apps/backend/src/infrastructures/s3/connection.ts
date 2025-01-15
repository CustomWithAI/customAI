import { config } from "@/config/env";
import { s3Logger } from "@/config/logger";
import { S3Client } from "bun";

const createS3Client = (): S3Client =>
  new S3Client({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    endpoint: config.S3_ENDPOINT,
    region: config.AWS_REGION,
  });

export const client = createS3Client();

export const testS3Connection = async (): Promise<boolean> => {
  try {
    const testFile = client.file("test-connection.json");
    await testFile.write("Connection successful!");
    await testFile.delete();
    s3Logger.info("✅  S3 connection is working correctly");
    return true;
  } catch (error) {
    s3Logger.info("❌ Failed to connect to S3:", error);
    s3Logger.info(error); // Inspect error message
    return false;
  }
};
