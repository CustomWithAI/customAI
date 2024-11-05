import { spreads } from "@/utils/db-spread";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { user } from "../schema/auth";

export const userModel = {
  insert: spreads(
    {
      user: createInsertSchema(user, {
        email: t.String({ format: "email", maxLength: 160 }),
      }),
    },
    "insert"
  ),
  select: spreads(
    {
      user: createSelectSchema(user, {
        email: t.String({ format: "email", maxLength: 160 }),
      }),
    },
    "select"
  ),
} as const;
