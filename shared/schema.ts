import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  tonAddress: text("ton_address"),
  tonBalance: integer("ton_balance").default(0).notNull(),
  flameBalance: integer("flame_balance").default(0).notNull(),
  miningPower: integer("mining_power").default(0).notNull(),
  dailyYield: integer("daily_yield").default(0).notNull(),
  equipmentCount: integer("equipment_count").default(0).notNull(),
  equipmentMax: integer("equipment_max").default(8).notNull(),
  premiumTier: text("premium_tier").default("none").notNull(), // none, standard, vip
  premiumExpiresAt: timestamp("premium_expires_at"),
  premiumDaysLeft: integer("premium_days_left").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Equipment model
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  marketId: integer("market_id").references(() => marketItems.id),
  name: text("name").notNull(),
  rarity: text("rarity").notNull(), // Common, Rare, Legendary, Exclusive
  icon: text("icon").notNull(),
  durability: integer("durability").default(100).notNull(),
  repairCost: integer("repair_cost").default(0).notNull(),
  isEquipped: boolean("is_equipped").default(false).notNull(),
  stats: jsonb("stats").notNull(), // Array of stats: [{icon: string, value: string}]
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Market items
export const marketItems = pgTable("market_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rarity: text("rarity").notNull(),
  icon: text("icon").notNull(),
  tonPrice: text("ton_price").notNull(),
  flamePrice: integer("flame_price").notNull(),
  stats: jsonb("stats").notNull(), // Array of stats
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mining sites
export const miningSites = pgTable("mining_sites", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard, Extreme
  imageUrl: text("image_url").notNull(),
  yieldRate: integer("yield_rate").notNull(), // Flame Coins per hour
  minPower: integer("min_power").notNull(), // Minimum mining power required
  activeMiners: integer("active_miners").default(0).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  seasonalEvent: boolean("seasonal_event").default(false).notNull(),
  isEventActive: boolean("is_event_active").default(true).notNull(),
  remainingTime: text("remaining_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mining sessions
export const miningSessions = pgTable("mining_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  siteId: integer("site_id").references(() => miningSites.id),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastCollectedAt: timestamp("last_collected_at").defaultNow().notNull(),
  accumulatedReward: integer("accumulated_reward").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Trading offers
export const tradingOffers = pgTable("trading_offers", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").references(() => users.id),
  sellerName: text("seller_name").notNull(),
  equipmentId: integer("equipment_id").references(() => equipment.id),
  tonPrice: text("ton_price").notNull(),
  flamePrice: integer("flame_price").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // SEND, RECEIVE, BUY, SELL, REPAIR, MINT
  amount: integer("amount").notNull(),
  isTon: boolean("is_ton").default(false).notNull(), // true for TON, false for Flame Coin
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Define insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  createdAt: true,
});

export const insertMarketItemSchema = createInsertSchema(marketItems).omit({
  id: true,
  createdAt: true,
});

export const insertMiningSiteSchema = createInsertSchema(miningSites).omit({
  id: true,
  createdAt: true,
});

export const insertMiningSessionSchema = createInsertSchema(miningSessions).omit({
  id: true,
});

export const insertTradingOfferSchema = createInsertSchema(tradingOffers).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;

export type MarketItem = typeof marketItems.$inferSelect;
export type InsertMarketItem = z.infer<typeof insertMarketItemSchema>;

export type MiningSite = typeof miningSites.$inferSelect;
export type InsertMiningSite = z.infer<typeof insertMiningSiteSchema>;

export type MiningSession = typeof miningSessions.$inferSelect;
export type InsertMiningSession = z.infer<typeof insertMiningSessionSchema>;

export type TradingOffer = typeof tradingOffers.$inferSelect & { equipment: Equipment };
export type InsertTradingOffer = z.infer<typeof insertTradingOfferSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
