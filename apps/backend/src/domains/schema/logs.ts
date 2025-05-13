import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { trainings } from "@/domains/schema/trainings";
import { v7 } from "uuid";

export const logs = pgTable(
  "logs",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => v7()),
    data: text("data").notNull(),
    trainingId: varchar("training_id")
      .notNull()
      .references(() => trainings.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("training_id_data").on(table.trainingId, table.data)]
);
