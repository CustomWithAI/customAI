import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

import { spreads } from "@/utils/db-spread";
import { user } from "../schema/auth";

export const userModel = {
  insert: spreads(
    {
      user: createInsertSchema(user, {
        email: t.String({ format: "email" }),
      }),
    },
    "insert"
  ),
  select: spreads(
    {
      user: createSelectSchema(user, {
        email: t.String({ format: "email" }),
      }),
    },
    "select"
  ),
} as const;
