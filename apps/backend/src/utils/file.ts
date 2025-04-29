import sharp from "sharp";

export const convertToJpg = async (file: File): Promise<Buffer> => {
  const buffer = await file.arrayBuffer();
  return sharp(Buffer.from(buffer)).jpeg().toBuffer();
};
