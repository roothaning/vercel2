import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertEquipmentSchema, insertMarketItemSchema, insertMiningSessionSchema, insertTradingOfferSchema, insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API Routes
  // All routes are prefixed with /api

  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      // In a real app, this would come from an authenticated session
      // For now, we'll return the demo user
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Calculate premium days left if premium is active
      if (user.premiumExpiresAt) {
        const now = new Date();
        const expiryDate = new Date(user.premiumExpiresAt);
        const daysLeft = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        user.premiumDaysLeft = daysLeft;
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  app.post("/api/user/create", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Wallet routes
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      
      // Check if wallet is already connected to a user
      let user = await storage.getUserByTonAddress(address);
      
      if (!user) {
        // In a real app, this would connect to an existing user's session
        // For now, we'll update the demo user
        user = await storage.getUserByUsername("FlameUser");
        if (user) {
          user = await storage.updateUser(user.id, { tonAddress: address });
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      }
      
      res.json({ message: "Wallet connected successfully", user });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  // Equipment routes
  app.get("/api/equipment/active", async (req, res) => {
    try {
      // In a real app, the user ID would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const equipment = await storage.getActiveEquipmentByUserId(user.id);
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching active equipment:", error);
      res.status(500).json({ message: "Failed to fetch active equipment" });
    }
  });

  app.get("/api/inventory", async (req, res) => {
    try {
      // In a real app, the user ID would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const equipment = await storage.getEquipmentByUserId(user.id);
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post("/api/equipment/equip", async (req, res) => {
    try {
      const { equipmentId } = req.body;
      
      if (!equipmentId) {
        return res.status(400).json({ message: "Equipment ID is required" });
      }
      
      const equipment = await storage.getEquipment(Number(equipmentId));
      
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      // In a real app, we would check if the equipment belongs to the authenticated user
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user || equipment.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to equip this item" });
      }
      
      // Check if user has reached the equipment limit
      const activeEquipment = await storage.getActiveEquipmentByUserId(user.id);
      if (activeEquipment.length >= user.equipmentMax) {
        return res.status(400).json({ message: "Maximum equipment limit reached" });
      }
      
      const updatedEquipment = await storage.updateEquipment(equipment.id, { isEquipped: true });
      res.json(updatedEquipment);
    } catch (error) {
      console.error("Error equipping item:", error);
      res.status(500).json({ message: "Failed to equip item" });
    }
  });

  app.post("/api/equipment/unequip", async (req, res) => {
    try {
      const { equipmentId } = req.body;
      
      if (!equipmentId) {
        return res.status(400).json({ message: "Equipment ID is required" });
      }
      
      const equipment = await storage.getEquipment(Number(equipmentId));
      
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      // In a real app, we would check if the equipment belongs to the authenticated user
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user || equipment.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to unequip this item" });
      }
      
      const updatedEquipment = await storage.updateEquipment(equipment.id, { isEquipped: false });
      res.json(updatedEquipment);
    } catch (error) {
      console.error("Error unequipping item:", error);
      res.status(500).json({ message: "Failed to unequip item" });
    }
  });

  app.post("/api/equipment/repair", async (req, res) => {
    try {
      const { equipmentId } = req.body;
      
      if (!equipmentId) {
        return res.status(400).json({ message: "Equipment ID is required" });
      }
      
      const equipment = await storage.getEquipment(Number(equipmentId));
      
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      // In a real app, we would check if the equipment belongs to the authenticated user
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user || equipment.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to repair this item" });
      }
      
      // Check if repair is needed
      if (equipment.durability >= 100) {
        return res.status(400).json({ message: "Equipment is already at full durability" });
      }
      
      // Check if user has enough Flame Coins
      if (user.flameBalance < equipment.repairCost) {
        return res.status(400).json({ message: "Insufficient Flame Coins for repair" });
      }
      
      // Update equipment durability
      const updatedEquipment = await storage.updateEquipment(equipment.id, { durability: 100 });
      
      // Deduct repair cost from user's balance
      await storage.updateUser(user.id, { flameBalance: user.flameBalance - equipment.repairCost });
      
      // Create a transaction record for the repair
      await storage.createTransaction({
        userId: user.id,
        type: "REPAIR",
        amount: equipment.repairCost,
        isTon: false,
        description: `Repaired ${equipment.name}`
      });
      
      res.json(updatedEquipment);
    } catch (error) {
      console.error("Error repairing equipment:", error);
      res.status(500).json({ message: "Failed to repair equipment" });
    }
  });

  // Market routes
  app.get("/api/market/items", async (req, res) => {
    try {
      const marketItems = await storage.getAllMarketItems();
      res.json(marketItems);
    } catch (error) {
      console.error("Error fetching market items:", error);
      res.status(500).json({ message: "Failed to fetch market items" });
    }
  });

  app.post("/api/market/buy", async (req, res) => {
    try {
      const { itemId } = req.body;
      
      if (!itemId) {
        return res.status(400).json({ message: "Item ID is required" });
      }
      
      const marketItem = await storage.getMarketItem(Number(itemId));
      
      if (!marketItem) {
        return res.status(404).json({ message: "Market item not found" });
      }
      
      // In a real app, the user would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has TON wallet connected
      if (!user.tonAddress) {
        return res.status(400).json({ message: "TON wallet not connected" });
      }
      
      // For this example, we'll assume payment with Flame Coins
      // Check if user has enough Flame Coins
      if (user.flameBalance < marketItem.flamePrice) {
        return res.status(400).json({ message: "Insufficient Flame Coins" });
      }
      
      // Deduct coins from user's balance
      const updatedUser = await storage.updateUser(user.id, { 
        flameBalance: user.flameBalance - marketItem.flamePrice 
      });
      
      // Create the equipment for the user
      const newEquipment = await storage.createEquipment({
        userId: user.id,
        marketId: marketItem.id,
        name: marketItem.name,
        rarity: marketItem.rarity,
        icon: marketItem.icon,
        durability: 100,
        repairCost: Math.floor(marketItem.flamePrice * 0.05), // 5% of the price as repair cost
        isEquipped: false,
        stats: marketItem.stats as any
      });
      
      // Create a transaction record
      await storage.createTransaction({
        userId: user.id,
        type: "BUY",
        amount: marketItem.flamePrice,
        isTon: false,
        description: `Purchased ${marketItem.name}`
      });
      
      res.json(newEquipment);
    } catch (error) {
      console.error("Error buying item:", error);
      res.status(500).json({ message: "Failed to buy item" });
    }
  });

  app.post("/api/market/list", async (req, res) => {
    try {
      // In a real app, the user would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // This route would normally create a listing for a user's equipment
      // For now, we'll just return a success message
      res.json({ message: "Ready to list equipment" });
    } catch (error) {
      console.error("Error listing equipment:", error);
      res.status(500).json({ message: "Failed to list equipment" });
    }
  });

  // Mining routes
  app.get("/api/mining/sites", async (req, res) => {
    try {
      const miningSites = await storage.getAllMiningSites();
      res.json(miningSites);
    } catch (error) {
      console.error("Error fetching mining sites:", error);
      res.status(500).json({ message: "Failed to fetch mining sites" });
    }
  });

  app.get("/api/mining/status", async (req, res) => {
    try {
      // In a real app, the user would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has an active mining session
      const session = await storage.getUserActiveMiningSession(user.id);
      
      if (!session) {
        return res.json({ isActive: false, progress: 0, lastHourReward: 0 });
      }
      
      // Calculate mining progress
      const now = new Date();
      const startTime = new Date(session.startedAt);
      const lastCollect = new Date(session.lastCollectedAt);
      
      // In a real app, progress would be calculated based on various factors
      // For now, we'll use a simple calculation based on time elapsed
      const progressCycle = 60 * 60 * 1000; // 60 minutes (1 hour) for full cycle
      const elapsedSinceStart = now.getTime() - startTime.getTime();
      const progress = Math.min(100, Math.floor((elapsedSinceStart % progressCycle) / progressCycle * 100));
      
      // Calculate rewards for the last hour
      let lastHourReward = 0;
      
      if (session.siteId !== null) {
        const site = await storage.getMiningSite(session.siteId);
        if (site) {
          const hoursSinceLastCollect = (now.getTime() - lastCollect.getTime()) / (60 * 60 * 1000);
          lastHourReward = Math.floor(site.yieldRate * Math.min(1, hoursSinceLastCollect));
        }
      }
      
      res.json({
        isActive: session.isActive,
        progress,
        lastHourReward,
        accumulatedReward: session.accumulatedReward
      });
    } catch (error) {
      console.error("Error fetching mining status:", error);
      res.status(500).json({ message: "Failed to fetch mining status" });
    }
  });

  app.post("/api/mining/start", async (req, res) => {
    try {
      const { siteId } = req.body;
      
      if (!siteId) {
        return res.status(400).json({ message: "Mining site ID is required" });
      }
      
      const site = await storage.getMiningSite(Number(siteId));
      
      if (!site) {
        return res.status(404).json({ message: "Mining site not found" });
      }
      
      // In a real app, the user would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if site is premium and user has premium
      if (site.isPremium && (!user.premiumTier || user.premiumTier === "none")) {
        return res.status(403).json({ message: "This site requires a premium subscription" });
      }
      
      // Check if user has enough mining power
      if (user.miningPower < site.minPower) {
        return res.status(400).json({ message: `Insufficient mining power. Need at least ${site.minPower} MP` });
      }
      
      // Check if user already has an active mining session
      const existingSession = await storage.getUserActiveMiningSession(user.id);
      
      if (existingSession) {
        // End the current session
        await storage.updateMiningSession(existingSession.id, { isActive: false });
      }
      
      // Start a new mining session
      const session = await storage.createMiningSession({
        userId: user.id,
        siteId: site.id,
        startedAt: new Date(),
        lastCollectedAt: new Date(),
        accumulatedReward: 0,
        isActive: true
      });
      
      res.json(session);
    } catch (error) {
      console.error("Error starting mining:", error);
      res.status(500).json({ message: "Failed to start mining" });
    }
  });

  app.post("/api/mining/collect", async (req, res) => {
    try {
      // In a real app, the user would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has an active mining session
      const session = await storage.getUserActiveMiningSession(user.id);
      
      if (!session) {
        return res.status(400).json({ message: "No active mining session" });
      }
      
      // Get the mining site to calculate rewards
      if (session.siteId === null) {
        return res.status(400).json({ message: "Invalid mining site" });
      }
      const site = await storage.getMiningSite(session.siteId);
      
      if (!site) {
        return res.status(404).json({ message: "Mining site not found" });
      }
      
      // Calculate rewards based on time elapsed since last collection
      const now = new Date();
      const lastCollect = new Date(session.lastCollectedAt);
      const hoursSinceLastCollect = (now.getTime() - lastCollect.getTime()) / (60 * 60 * 1000);
      
      // Calculate base reward
      let reward = Math.floor(site.yieldRate * hoursSinceLastCollect);
      
      // Apply premium bonus if applicable
      if (user.premiumTier === "standard") {
        reward = Math.floor(reward * 1.2); // 20% bonus
      } else if (user.premiumTier === "vip") {
        reward = Math.floor(reward * 1.5); // 50% bonus
      }
      
      // Update user's Flame Coin balance
      await storage.updateUser(user.id, { flameBalance: user.flameBalance + reward });
      
      // Update mining session
      await storage.updateMiningSession(session.id, {
        lastCollectedAt: now,
        accumulatedReward: session.accumulatedReward + reward
      });
      
      // Create a transaction record
      await storage.createTransaction({
        userId: user.id,
        type: "RECEIVE",
        amount: reward,
        isTon: false,
        description: `Mining rewards from ${site.name}`
      });
      
      // Update equipment durability
      const activeEquipment = await storage.getActiveEquipmentByUserId(user.id);
      
      for (const equipment of activeEquipment) {
        // Random durability decrease based on rarity (less for higher rarity)
        let durabilityLoss = 0;
        
        switch (equipment.rarity) {
          case "Common":
            durabilityLoss = Math.floor(Math.random() * 5) + 3; // 3-7%
            break;
          case "Rare":
            durabilityLoss = Math.floor(Math.random() * 3) + 2; // 2-4%
            break;
          case "Legendary":
            durabilityLoss = Math.floor(Math.random() * 2) + 1; // 1-2%
            break;
          case "Exclusive":
            durabilityLoss = Math.floor(Math.random() * 2); // 0-1%
            break;
        }
        
        // Apply durability loss
        const newDurability = Math.max(0, equipment.durability - durabilityLoss);
        await storage.updateEquipment(equipment.id, { durability: newDurability });
      }
      
      res.json({ amount: reward });
    } catch (error) {
      console.error("Error collecting mining rewards:", error);
      res.status(500).json({ message: "Failed to collect mining rewards" });
    }
  });

  // Trading routes
  app.get("/api/trading/offers", async (req, res) => {
    try {
      const offers = await storage.getAllTradingOffers();
      res.json(offers);
    } catch (error) {
      console.error("Error fetching trading offers:", error);
      res.status(500).json({ message: "Failed to fetch trading offers" });
    }
  });

  // Premium subscription routes
  app.post("/api/premium/subscribe", async (req, res) => {
    try {
      const { tier, paymentType } = req.body;
      
      if (!tier || !paymentType) {
        return res.status(400).json({ message: "Tier and payment type are required" });
      }
      
      if (tier !== "standard" && tier !== "vip") {
        return res.status(400).json({ message: "Invalid tier" });
      }
      
      if (paymentType !== "ton" && paymentType !== "flame") {
        return res.status(400).json({ message: "Invalid payment type" });
      }
      
      // In a real app, the user would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has TON wallet connected for TON payments
      if (paymentType === "ton" && !user.tonAddress) {
        return res.status(400).json({ message: "TON wallet not connected" });
      }
      
      // Set subscription duration based on tier
      const durationInDays = tier === "standard" ? 30 : 365;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + durationInDays);
      
      // Handle payment (in a real app, this would integrate with TON blockchain)
      let paymentAmount = 0;
      
      if (tier === "standard") {
        paymentAmount = paymentType === "ton" ? 2.5 : 1000;
      } else {
        paymentAmount = paymentType === "ton" ? 25 : 10000;
      }
      
      // Check if user has enough balance for Flame Coin payments
      if (paymentType === "flame" && user.flameBalance < paymentAmount) {
        return res.status(400).json({ message: "Insufficient Flame Coins" });
      }
      
      // Process payment
      if (paymentType === "flame") {
        await storage.updateUser(user.id, { flameBalance: user.flameBalance - paymentAmount });
      }
      
      // Update user's premium status
      const updatedUser = await storage.updateUser(user.id, {
        premiumTier: tier,
        premiumExpiresAt: expiryDate,
        premiumDaysLeft: durationInDays
      });
      
      // Create a transaction record
      await storage.createTransaction({
        userId: user.id,
        type: "SEND",
        amount: paymentAmount,
        isTon: paymentType === "ton",
        description: `Premium subscription - ${tier}`
      });
      
      res.json({ tier, expiryDate, daysLeft: durationInDays });
    } catch (error) {
      console.error("Error processing premium subscription:", error);
      res.status(500).json({ message: "Failed to process premium subscription" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      // In a real app, the user would come from the authenticated session
      const user = await storage.getUserByUsername("FlameUser");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const transactions = await storage.getUserTransactions(user.id);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const { from, to, amount } = req.body;
      
      if (!from || !to || !amount) {
        return res.status(400).json({ message: "From, to, and amount are required" });
      }
      
      // In a real app, this would integrate with TON blockchain
      // For now, we'll just simulate a transaction
      
      // Get the sender user
      const user = await storage.getUserByTonAddress(from);
      
      if (!user) {
        return res.status(404).json({ message: "Sender not found" });
      }
      
      // Create a transaction record
      const transaction = await storage.createTransaction({
        userId: user.id,
        type: "SEND",
        amount,
        isTon: true,
        description: `TON transfer to ${to.substring(0, 8)}...`
      });
      
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  return httpServer;
}
