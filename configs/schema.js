import { pgTable, serial, varchar, boolean, json, timestamp } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  imageUrl: varchar("imageUrl", { length: 255 }),
  subscription: boolean("subscription").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const VideoData = pgTable('videoData', {
  id: serial('id').primaryKey(),
  script: json('script').notNull(),
  audioFileUrl: varchar('audioFileUrl').notNull(),
  captions: json('captions').notNull(),
  imageList: varchar('imageList').array(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});