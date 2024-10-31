import { Schema } from "redis-om";

export type RateLimitSchema = {
  key: string;
  count: number;
  lastRequest: number;
};

export const rateLimitSchema = new Schema<RateLimitSchema>("RateLimit", {
  key: { type: "string" },
  count: { type: "number" },
  lastRequest: { type: "number" },
});
