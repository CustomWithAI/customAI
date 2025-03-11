import fs from "node:fs";
import { Elysia } from "elysia";
import { join } from "node:path";
import { enumResponseDto, type EnumResponseDto } from "@/domains/dtos/enum";

const jsonPath = join(__dirname, "../../domains/jsons/enum.json");

export const enumController = new Elysia({
  name: "enum-controller",
  prefix: "/enum",
  detail: {
    tags: ["Enum"],
  },
}).get(
  "/",
  async () => {
    const data = JSON.parse(
      fs.readFileSync(jsonPath, "utf-8")
    ) as EnumResponseDto;
    return data;
  },
  { response: enumResponseDto }
);
