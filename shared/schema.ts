import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const garments = pgTable("garments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  subCategory: text("sub_category"),
  brand: text("brand"),
  notes: text("notes"),
  tag: text("tag").default("keep"), // keep, review, donate
  favourite: boolean("favourite").default(false),
  hidden: boolean("hidden").default(false),
  colour: text("colour"),
  fabric: text("fabric"),
  careInstructions: text("care_instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const garmentPhotos = pgTable("garment_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  garmentId: varchar("garment_id").notNull(),
  type: text("type").notNull(), // front, back, detail
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const garmentMeasurements = pgTable("garment_measurements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  garmentId: varchar("garment_id").notNull(),
  shoulder: text("shoulder"),
  bust: text("bust"),
  waist: text("waist"),
  hips: text("hips"),
  length: text("length"),
  sleeve: text("sleeve"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stylistAccessLinks = pgTable("stylist_access_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  permissions: text("permissions").default("view_all"), // view_all, view_selected
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accessLogs = pgTable("access_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  linkId: varchar("link_id").notNull(),
  accessedAt: timestamp("accessed_at").defaultNow(),
  action: text("action").notNull(), // view_wardrobe, view_garment
  details: text("details"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGarmentSchema = createInsertSchema(garments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Garment = typeof garments.$inferSelect;
export type GarmentPhoto = typeof garmentPhotos.$inferSelect;
export type GarmentMeasurement = typeof garmentMeasurements.$inferSelect;
export type StylistAccessLink = typeof stylistAccessLinks.$inferSelect;
export type AccessLog = typeof accessLogs.$inferSelect;
