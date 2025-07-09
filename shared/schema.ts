import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const digitalAssets = pgTable("digital_assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  filename: text("filename").notNull(),
  fileFormat: text("file_format").notNull(),
  dimensions: text("dimensions").notNull(),
  iconName: text("icon_name").notNull(),
  category: text("category").notNull().default("logistics"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertDigitalAssetSchema = createInsertSchema(digitalAssets).omit({
  id: true,
});

export type InsertDigitalAsset = z.infer<typeof insertDigitalAssetSchema>;
export type DigitalAsset = typeof digitalAssets.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
