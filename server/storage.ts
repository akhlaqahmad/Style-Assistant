import { type User, type InsertUser, type Garment, type StylistAccessLink } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Garments
  createGarment(garment: Omit<Garment, "id" | "createdAt">): Promise<Garment>;
  getGarmentsByUserId(userId: string): Promise<Garment[]>;
  getGarment(id: string): Promise<Garment | undefined>;

  // Stylist Links
  createStylistLink(link: Omit<StylistAccessLink, "id" | "createdAt">): Promise<StylistAccessLink>;
  getStylistLinkByToken(token: string): Promise<StylistAccessLink | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private garments: Map<string, Garment>;
  private stylistLinks: Map<string, StylistAccessLink>;

  constructor() {
    this.users = new Map();
    this.garments = new Map();
    this.stylistLinks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGarment(garment: Omit<Garment, "id" | "createdAt">): Promise<Garment> {
    const id = randomUUID();
    const newGarment: Garment = { ...garment, id, createdAt: new Date() };
    this.garments.set(id, newGarment);
    return newGarment;
  }

  async getGarmentsByUserId(userId: string): Promise<Garment[]> {
    return Array.from(this.garments.values()).filter(g => g.userId === userId);
  }

  async getGarment(id: string): Promise<Garment | undefined> {
    return this.garments.get(id);
  }

  async createStylistLink(link: Omit<StylistAccessLink, "id" | "createdAt">): Promise<StylistAccessLink> {
    const id = randomUUID();
    const newLink: StylistAccessLink = { ...link, id, createdAt: new Date() };
    this.stylistLinks.set(id, newLink);
    return newLink;
  }

  async getStylistLinkByToken(token: string): Promise<StylistAccessLink | undefined> {
    return Array.from(this.stylistLinks.values()).find(l => l.token === token);
  }
}

export const storage = new MemStorage();
