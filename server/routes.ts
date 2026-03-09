import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage";
import { insertGarmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  app.post("/api/garments", async (req, res) => {
    try {
      const garmentData = insertGarmentSchema.parse(req.body);
      const garment = await storage.createGarment(garmentData);
      res.json(garment);
    } catch (e) {
      res.status(400).json({ error: "Invalid garment data" });
    }
  });

  app.get("/api/garments", async (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const garments = await storage.getGarmentsByUserId(userId);
    res.json(garments);
  });

  app.post("/api/stylist-links", async (req, res) => {
    const { userId, permissions, expiresInDays } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7));

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const link = await storage.createStylistLink({
      userId,
      token,
      expiresAt,
      permissions: permissions || "view_all",
      active: true,
    });

    res.json(link);
  });

  app.get("/api/stylist-access/:token", async (req, res) => {
    const { token } = req.params;
    const link = await storage.getStylistLinkByToken(token);

    if (!link || !link.active || new Date() > link.expiresAt) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Log access (mocked for now, as schema has access_logs but storage doesn't implement it yet)
    console.log(`Stylist accessed wardrobe via token ${token}`);

    const garments = await storage.getGarmentsByUserId(link.userId);
    
    // Filter based on permissions if needed
    // if (link.permissions === 'view_selected') ...

    res.json({ garments, ownerId: link.userId });
  });

  const httpServer = createServer(app);

  return httpServer;
}
