import { config } from "@/config/env";
import { client } from "@/infrastructures/s3/connection";

export const uploadFile = async (
  filePath: string,
  fileContent: string | ArrayBuffer | Buffer,
  contentType: string
): Promise<void> => {
  const file = client.file(filePath);
  await file.write(fileContent, { type: contentType });
};

export const readJsonFile = async <T extends object>(
  filePath: string
): Promise<T> => {
  const file = client.file(filePath);
  return file.json();
};

export const downloadFile = async (key: string): Promise<string | null> => {
  try {
    const s3file = client.file(key);
    return s3file.text();
  } catch (error) {
    console.error(`Failed to download file ${key}:`, error);
    return null;
  }
};

export const deleteFile = async (filePath: string): Promise<void> => {
  const file = client.file(filePath);
  await file.delete();
};

export const generatePresignedUrl = (
  filePath: string,
  useBy: "client" | "server" = "client",
  expiresIn = 3600
): string => {
  let presignedUrl = client.presign(filePath, {
    acl: "public-read",
    expiresIn,
  });

  if (process.env.NODE_ENV === "development" && useBy === "client") {
    presignedUrl = presignedUrl.replace(
      config.S3_ENDPOINT,
      config.S3_DEVELOPMENT_ENDPOINT
    );
  }

  return presignedUrl;
};
