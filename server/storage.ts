import {
  User, InsertUser,
  Equipment, InsertEquipment,
  MarketItem, InsertMarketItem,
  MiningSite, InsertMiningSite,
  MiningSession, InsertMiningSession,
  TradingOffer, InsertTradingOffer,
  Transaction, InsertTransaction
} from "@shared/schema";

// Storage interface for the game
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTonAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Equipment operations
  getEquipment(id: number): Promise<Equipment | undefined>;
  getEquipmentByUserId(userId: number): Promise<Equipment[]>;
  getActiveEquipmentByUserId(userId: number): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, updates: Partial<Equipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number): Promise<boolean>;
  
  // Market operations
  getMarketItem(id: number): Promise<MarketItem | undefined>;
  getAllMarketItems(): Promise<MarketItem[]>;
  createMarketItem(item: InsertMarketItem): Promise<MarketItem>;
  updateMarketItem(id: number, updates: Partial<MarketItem>): Promise<MarketItem | undefined>;
  
  // Mining operations
  getMiningSite(id: number): Promise<MiningSite | undefined>;
  getAllMiningSites(): Promise<MiningSite[]>;
  createMiningSite(site: InsertMiningSite): Promise<MiningSite>;
  updateMiningSite(id: number, updates: Partial<MiningSite>): Promise<MiningSite | undefined>;
  getMiningSession(id: number): Promise<MiningSession | undefined>;
  getUserActiveMiningSession(userId: number): Promise<MiningSession | undefined>;
  createMiningSession(session: InsertMiningSession): Promise<MiningSession>;
  updateMiningSession(id: number, updates: Partial<MiningSession>): Promise<MiningSession | undefined>;
  
  // Trading operations
  getTradingOffer(id: number): Promise<TradingOffer | undefined>;
  getAllTradingOffers(): Promise<TradingOffer[]>;
  createTradingOffer(offer: InsertTradingOffer): Promise<TradingOffer>;
  updateTradingOffer(id: number, updates: Partial<TradingOffer>): Promise<TradingOffer | undefined>;
  deleteTradingOffer(id: number): Promise<boolean>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private equipment: Map<number, Equipment>;
  private marketItems: Map<number, MarketItem>;
  private miningSites: Map<number, MiningSite>;
  private miningSessions: Map<number, MiningSession>;
  private tradingOffers: Map<number, TradingOffer>;
  private transactions: Map<number, Transaction>;
  
  private userIdCounter: number;
  private equipmentIdCounter: number;
  private marketItemIdCounter: number;
  private miningSiteIdCounter: number;
  private miningSessionIdCounter: number;
  private tradingOfferIdCounter: number;
  private transactionIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.equipment = new Map();
    this.marketItems = new Map();
    this.miningSites = new Map();
    this.miningSessions = new Map();
    this.tradingOffers = new Map();
    this.transactions = new Map();
    
    this.userIdCounter = 1;
    this.equipmentIdCounter = 1;
    this.marketItemIdCounter = 1;
    this.miningSiteIdCounter = 1;
    this.miningSessionIdCounter = 1;
    this.tradingOfferIdCounter = 1;
    this.transactionIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByTonAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.tonAddress === address
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      id, 
      createdAt: now,
      username: insertUser.username,
      tonAddress: insertUser.tonAddress ?? null,
      flameBalance: insertUser.flameBalance ?? 100, // Start with some Flame Coins
      tonBalance: insertUser.tonBalance ?? 0,
      miningPower: insertUser.miningPower ?? 10,
      dailyYield: insertUser.dailyYield ?? 20,
      equipmentCount: insertUser.equipmentCount ?? 0,
      equipmentMax: insertUser.equipmentMax ?? 8,
      premiumTier: insertUser.premiumTier ?? "none",
      premiumExpiresAt: insertUser.premiumExpiresAt ?? null,
      premiumDaysLeft: insertUser.premiumDaysLeft ?? 0
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Equipment operations
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }
  
  async getEquipmentByUserId(userId: number): Promise<Equipment[]> {
    return Array.from(this.equipment.values()).filter(
      (eq) => eq.userId === userId
    );
  }
  
  async getActiveEquipmentByUserId(userId: number): Promise<Equipment[]> {
    return Array.from(this.equipment.values()).filter(
      (eq) => eq.userId === userId && eq.isEquipped
    );
  }
  
  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const id = this.equipmentIdCounter++;
    const now = new Date();
    
    // Ensure all required fields are present with default values if not provided
    const equipment: Equipment = { 
      id, 
      createdAt: now,
      name: insertEquipment.name,
      rarity: insertEquipment.rarity,
      icon: insertEquipment.icon,
      stats: insertEquipment.stats,
      userId: insertEquipment.userId ?? null,
      marketId: insertEquipment.marketId ?? null,
      durability: insertEquipment.durability ?? 100,
      repairCost: insertEquipment.repairCost ?? 0,
      isEquipped: insertEquipment.isEquipped ?? false
    };
    
    this.equipment.set(id, equipment);
    
    // Update user's equipment count
    if (equipment.userId) {
      const user = await this.getUser(equipment.userId);
      if (user) {
        await this.updateUser(user.id, { 
          equipmentCount: user.equipmentCount + 1,
          miningPower: user.miningPower + this.calculateEquipmentPower(equipment)
        });
      }
    }
    
    return equipment;
  }
  
  async updateEquipment(id: number, updates: Partial<Equipment>): Promise<Equipment | undefined> {
    const equipment = this.equipment.get(id);
    if (!equipment) return undefined;
    
    // If equipment is being equipped/unequipped, update user's mining power
    if (equipment.userId && updates.isEquipped !== undefined && updates.isEquipped !== equipment.isEquipped) {
      const user = await this.getUser(equipment.userId);
      if (user) {
        const powerChange = this.calculateEquipmentPower(equipment);
        const newPower = updates.isEquipped 
          ? user.miningPower + powerChange 
          : user.miningPower - powerChange;
        
        await this.updateUser(user.id, { miningPower: newPower });
      }
    }
    
    const updatedEquipment = { ...equipment, ...updates };
    this.equipment.set(id, updatedEquipment);
    return updatedEquipment;
  }
  
  async deleteEquipment(id: number): Promise<boolean> {
    const equipment = this.equipment.get(id);
    if (!equipment) return false;
    
    // Update user's equipment count if equipment belongs to a user
    if (equipment.userId) {
      const user = await this.getUser(equipment.userId);
      if (user) {
        await this.updateUser(user.id, { 
          equipmentCount: user.equipmentCount - 1,
          miningPower: equipment.isEquipped 
            ? user.miningPower - this.calculateEquipmentPower(equipment)
            : user.miningPower
        });
      }
    }
    
    return this.equipment.delete(id);
  }
  
  // Market operations
  async getMarketItem(id: number): Promise<MarketItem | undefined> {
    return this.marketItems.get(id);
  }
  
  async getAllMarketItems(): Promise<MarketItem[]> {
    return Array.from(this.marketItems.values()).filter(item => item.available);
  }
  
  async createMarketItem(insertItem: InsertMarketItem): Promise<MarketItem> {
    const id = this.marketItemIdCounter++;
    const now = new Date();
    
    // Ensure all required fields are present with default values if not provided
    const item: MarketItem = { 
      id, 
      createdAt: now,
      name: insertItem.name,
      rarity: insertItem.rarity,
      icon: insertItem.icon,
      tonPrice: insertItem.tonPrice,
      flamePrice: insertItem.flamePrice,
      stats: insertItem.stats,
      available: insertItem.available ?? true
    };
    
    this.marketItems.set(id, item);
    return item;
  }
  
  async updateMarketItem(id: number, updates: Partial<MarketItem>): Promise<MarketItem | undefined> {
    const item = this.marketItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.marketItems.set(id, updatedItem);
    return updatedItem;
  }
  
  // Mining operations
  async getMiningSite(id: number): Promise<MiningSite | undefined> {
    return this.miningSites.get(id);
  }
  
  async getAllMiningSites(): Promise<MiningSite[]> {
    return Array.from(this.miningSites.values());
  }
  
  async createMiningSite(insertSite: InsertMiningSite): Promise<MiningSite> {
    const id = this.miningSiteIdCounter++;
    const now = new Date();
    
    // Ensure all required fields are present with default values if not provided
    const site: MiningSite = { 
      id, 
      createdAt: now,
      name: insertSite.name,
      difficulty: insertSite.difficulty,
      imageUrl: insertSite.imageUrl,
      yieldRate: insertSite.yieldRate,
      minPower: insertSite.minPower,
      activeMiners: insertSite.activeMiners ?? 0,
      isPremium: insertSite.isPremium ?? false,
      seasonalEvent: insertSite.seasonalEvent ?? false,
      isEventActive: insertSite.isEventActive ?? true,
      remainingTime: insertSite.remainingTime ?? null
    };
    
    this.miningSites.set(id, site);
    return site;
  }
  
  async updateMiningSite(id: number, updates: Partial<MiningSite>): Promise<MiningSite | undefined> {
    const site = this.miningSites.get(id);
    if (!site) return undefined;
    
    const updatedSite = { ...site, ...updates };
    this.miningSites.set(id, updatedSite);
    return updatedSite;
  }
  
  async getMiningSession(id: number): Promise<MiningSession | undefined> {
    return this.miningSessions.get(id);
  }
  
  async getUserActiveMiningSession(userId: number): Promise<MiningSession | undefined> {
    return Array.from(this.miningSessions.values()).find(
      (session) => session.userId === userId && session.isActive
    );
  }
  
  async createMiningSession(insertSession: InsertMiningSession): Promise<MiningSession> {
    const id = this.miningSessionIdCounter++;
    
    // Ensure all required fields are present with default values if not provided
    const session: MiningSession = { 
      id,
      userId: insertSession.userId ?? null,
      siteId: insertSession.siteId ?? null,
      startedAt: insertSession.startedAt ?? new Date(),
      lastCollectedAt: insertSession.lastCollectedAt ?? new Date(),
      accumulatedReward: insertSession.accumulatedReward ?? 0,
      isActive: insertSession.isActive ?? true
    };
    
    this.miningSessions.set(id, session);
    
    // Increment active miners count for the site
    if (session.siteId !== null) {
      const site = await this.getMiningSite(session.siteId);
      if (site) {
        await this.updateMiningSite(site.id, { activeMiners: site.activeMiners + 1 });
      }
    }
    
    return session;
  }
  
  async updateMiningSession(id: number, updates: Partial<MiningSession>): Promise<MiningSession | undefined> {
    const session = this.miningSessions.get(id);
    if (!session) return undefined;
    
    // If session is becoming inactive, decrement active miners count
    if (session.isActive && updates.isActive === false && session.siteId !== null) {
      const site = await this.getMiningSite(session.siteId);
      if (site) {
        await this.updateMiningSite(site.id, { activeMiners: Math.max(0, site.activeMiners - 1) });
      }
    }
    
    const updatedSession = { ...session, ...updates };
    this.miningSessions.set(id, updatedSession);
    return updatedSession;
  }
  
  // Trading operations
  async getTradingOffer(id: number): Promise<TradingOffer | undefined> {
    const offer = this.tradingOffers.get(id);
    if (!offer) return undefined;
    
    // Make sure we have a valid equipment ID before passing to getEquipment
    if (typeof offer.equipmentId !== 'number') {
      return undefined;
    }
    
    const equipment = await this.getEquipment(offer.equipmentId);
    if (!equipment) return undefined;
    
    return { ...offer, equipment };
  }
  
  async getAllTradingOffers(): Promise<TradingOffer[]> {
    const offers = Array.from(this.tradingOffers.values()).filter(offer => offer.isActive);
    
    // Attach equipment data to each offer
    const offersWithEquipment: TradingOffer[] = [];
    
    for (const offer of offers) {
      // Make sure we have a valid equipment ID
      if (typeof offer.equipmentId === 'number') {
        const equipment = await this.getEquipment(offer.equipmentId);
        if (equipment) {
          offersWithEquipment.push({ ...offer, equipment });
        }
      }
    }
    
    return offersWithEquipment;
  }
  
  async createTradingOffer(insertOffer: InsertTradingOffer): Promise<TradingOffer> {
    const id = this.tradingOfferIdCounter++;
    const now = new Date();
    
    // Ensure all required fields are present with default values if not provided
    const baseOffer = {
      equipmentId: insertOffer.equipmentId ?? 0,
      isActive: insertOffer.isActive ?? true,
      sellerId: insertOffer.sellerId ?? null,
      sellerName: insertOffer.sellerName,
      tonPrice: insertOffer.tonPrice,
      flamePrice: insertOffer.flamePrice,
      id,
      createdAt: now
    };
    
    this.tradingOffers.set(id, baseOffer);
    
    // Get equipment for the full offer return
    const equipment = await this.getEquipment(baseOffer.equipmentId);
    if (!equipment) {
      throw new Error("Equipment not found");
    }
    
    return { ...baseOffer, equipment };
  }
  
  async updateTradingOffer(id: number, updates: Partial<TradingOffer>): Promise<TradingOffer | undefined> {
    const offer = this.tradingOffers.get(id);
    if (!offer) return undefined;
    
    // Remove the equipment field from updates as it's not part of the base offer
    const { equipment, ...baseUpdates } = updates;
    
    const updatedOffer = { ...offer, ...baseUpdates };
    this.tradingOffers.set(id, updatedOffer);
    
    // Get equipment for the full offer return
    // If equipmentId is null, we'll handle it safely
    let equipmentData = null;
    if (updatedOffer.equipmentId !== null) {
      equipmentData = await this.getEquipment(updatedOffer.equipmentId);
      if (!equipmentData) {
        throw new Error("Equipment not found");
      }
    } else {
      throw new Error("Equipment ID cannot be null");
    }
    
    return { ...updatedOffer, equipment: equipmentData };
  }
  
  async deleteTradingOffer(id: number): Promise<boolean> {
    return this.tradingOffers.delete(id);
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    // Ensure all required fields are present with default values if not provided
    const transaction: Transaction = { 
      id, 
      timestamp: now,
      type: insertTransaction.type,
      amount: insertTransaction.amount,
      userId: insertTransaction.userId ?? null,
      isTon: insertTransaction.isTon ?? false,
      description: insertTransaction.description ?? null
    };
    
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  // Helper methods
  private calculateEquipmentPower(equipment: Equipment): number {
    // In a real implementation, this would calculate the mining power based on stats
    // For now, we'll use a simple calculation based on rarity
    switch (equipment.rarity) {
      case 'Legendary': return 45;
      case 'Rare': return 25;
      case 'Exclusive': return 35;
      default: return 10; // Common
    }
  }
  
  // Initialize with sample data
  private async initSampleData() {
    // Create demo user
    const demoUser = await this.createUser({
      username: "FlameUser",
      tonAddress: "UQBFXZrsMvcKgHJkXPPOLfv-9O4jJrZbTJR51zEaLQQKXVC3",
      tonBalance: 3.45,
      flameBalance: 1250,
      miningPower: 45,
      dailyYield: 120,
      equipmentCount: 4,
      equipmentMax: 8,
      premiumTier: "vip",
      premiumDaysLeft: 29
    });
    
    // Create market items
    await this.createMarketItem({
      name: "Molten Core Helmet",
      rarity: "Legendary",
      icon: "hard-hat",
      tonPrice: "2.5",
      flamePrice: 1200,
      stats: [
        { icon: "bolt", value: "+45 Mining Power" },
        { icon: "shield-alt", value: "+30% Heat Resistance" }
      ],
      available: true
    });
    
    await this.createMarketItem({
      name: "Precision Drill",
      rarity: "Rare",
      icon: "hammer",
      tonPrice: "0.85",
      flamePrice: 420,
      stats: [
        { icon: "bolt", value: "+22 Mining Power" },
        { icon: "fire-alt", value: "+10% Critical Mining" }
      ],
      available: true
    });
    
    await this.createMarketItem({
      name: "Basic Pickaxe",
      rarity: "Common",
      icon: "pickaxe",
      tonPrice: "0.25",
      flamePrice: 100,
      stats: [
        { icon: "bolt", value: "+10 Mining Power" }
      ],
      available: true
    });
    
    // Create equipment for demo user
    await this.createEquipment({
      userId: demoUser.id,
      marketId: 1,
      name: "Mining Drill",
      rarity: "Rare",
      icon: "drill",
      durability: 72,
      repairCost: 45,
      isEquipped: true,
      stats: [
        { icon: "bolt", value: "+18 Mining Power" }
      ]
    });
    
    await this.createEquipment({
      userId: demoUser.id,
      marketId: 1,
      name: "Phoenix Suit",
      rarity: "Legendary",
      icon: "vest",
      durability: 89,
      repairCost: 65,
      isEquipped: true,
      stats: [
        { icon: "shield-alt", value: "+25% Mining Efficiency" }
      ]
    });
    
    // Create mining sites
    await this.createMiningSite({
      name: "Flame Valley",
      difficulty: "Medium",
      imageUrl: "https://images.unsplash.com/photo-1581775524098-513a606be377?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      yieldRate: 12,
      minPower: 25,
      activeMiners: 42,
      isPremium: false,
      seasonalEvent: false,
      isEventActive: true
    });
    
    await this.createMiningSite({
      name: "Volcanic Depths",
      difficulty: "Hard",
      imageUrl: "https://images.unsplash.com/photo-1605478105648-23b211fbf1a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      yieldRate: 28,
      minPower: 65,
      activeMiners: 13,
      isPremium: true,
      seasonalEvent: false,
      isEventActive: true
    });
    
    await this.createMiningSite({
      name: "Crystal Caves",
      difficulty: "Extreme",
      imageUrl: "https://images.unsplash.com/photo-1576400883215-7083980b6193?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      yieldRate: 35,
      minPower: 120,
      activeMiners: 8,
      isPremium: false,
      seasonalEvent: true,
      isEventActive: true,
      remainingTime: "2d 14h"
    });
    
    // Create a mining session for the demo user
    await this.createMiningSession({
      userId: demoUser.id,
      siteId: 1,
      startedAt: new Date(),
      lastCollectedAt: new Date(),
      accumulatedReward: 35,
      isActive: true
    });
    
    // Create sample transactions
    await this.createTransaction({
      userId: demoUser.id,
      type: "RECEIVE",
      amount: 120,
      isTon: false,
      description: "Mining rewards collected"
    });
    
    await this.createTransaction({
      userId: demoUser.id,
      type: "SEND",
      amount: 0.5,
      isTon: true,
      description: "Purchased equipment"
    });
    
    // Create trading offers
    const equipment3 = await this.createEquipment({
      userId: demoUser.id,
      marketId: 2,
      name: "Energy Enhancer",
      rarity: "Rare",
      icon: "battery-full",
      durability: 95,
      repairCost: 40,
      isEquipped: false,
      stats: [
        { icon: "bolt", value: "+15% Energy Efficiency" },
        { icon: "clock", value: "+10% Mining Speed" }
      ]
    });
    
    await this.createTradingOffer({
      sellerId: demoUser.id,
      sellerName: demoUser.username,
      equipmentId: equipment3.id,
      tonPrice: "0.7",
      flamePrice: 350,
      isActive: true
    });
  }
}

export const storage = new MemStorage();
