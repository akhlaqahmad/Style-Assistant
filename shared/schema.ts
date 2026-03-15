import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, json } from "drizzle-orm/pg-core";
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
  subcategory: text("sub_category"),
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

export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  destination: text("destination").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  tripType: json("trip_type").notNull().$type<string[]>(),
  luggageType: text("luggage_type"),
  activities: text("activities"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tripOutfits = pgTable("trip_outfits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").notNull(),
  date: timestamp("date").notNull(),
  outfitDescription: text("outfit_description").notNull(),
  activities: text("activities"),
  weatherForecast: text("weather_forecast"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGarmentSchema = createInsertSchema(garments).omit({
  id: true,
  createdAt: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
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
export type Trip = typeof trips.$inferSelect;
export type TripOutfit = typeof tripOutfits.$inferSelect;
