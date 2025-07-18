import { digitalAssets, type DigitalAsset, type InsertDigitalAsset, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllDigitalAssets(): Promise<DigitalAsset[]>;
  getDigitalAsset(id: number): Promise<DigitalAsset | undefined>;
  createDigitalAsset(asset: InsertDigitalAsset): Promise<DigitalAsset>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private digitalAssets: Map<number, DigitalAsset>;
  private currentUserId: number;
  private currentAssetId: number;

  constructor() {
    this.users = new Map();
    this.digitalAssets = new Map();
    this.currentUserId = 1;
    this.currentAssetId = 1;
    
    // Initialize with the six required digital assets
    this.initializeAssets();
  }

  private initializeAssets() {
    const baseAssets = [
      {
        name: "Door Status Indicator",
        description: "Visual indicator showing container door status with real-time monitoring capabilities. Perfect for operational dashboards and status reports.",
        iconName: "door-open",
        category: "operational"
      },
      {
        name: "Internal Temperature Monitor",
        description: "Temperature monitoring system graphic for cold chain logistics presentations. Ideal for refrigerated cargo tracking slides.",
        iconName: "thermometer-half",
        category: "monitoring"
      },
      {
        name: "GPS Location Tracker",
        description: "Real-time GPS tracking visualization for cargo location monitoring. Essential for supply chain visibility presentations.",
        iconName: "map-marker-alt",
        category: "tracking"
      },
      {
        name: "Journey & Distance Tracker",
        description: "Mileage and distance calculation display for route optimization presentations. Perfect for logistics efficiency reports.",
        iconName: "route",
        category: "optimization"
      },
      {
        name: "Cargo Status Indicator",
        description: "Load status visualization showing loaded or empty container states. Essential for capacity management presentations.",
        iconName: "boxes",
        category: "capacity"
      },
      {
        name: "Motion Alert System",
        description: "Movement detection and alert system visualization for security and monitoring presentations. Ideal for safety protocol slides.",
        iconName: "exchange-alt",
        category: "security"
      }
    ];

    const versions = [
      { suffix: "Icon Only", description: "Icon only (no text, transparent background)" },
      { suffix: "With Text (Transparent)", description: "Icon with text on transparent background" },
      { suffix: "With Text (Solid Background)", description: "Icon with text on solid background" }
    ];

    const assets: InsertDigitalAsset[] = [];
    
    baseAssets.forEach(baseAsset => {
      versions.forEach((version, versionIndex) => {
        const assetName = baseAsset.name.toLowerCase().replace(/\s+/g, '-');
        assets.push({
          name: `${baseAsset.name} - ${version.suffix}`,
          description: `${baseAsset.description} ${version.description}`,
          filename: `${assetName}-v${versionIndex + 1}.png`,
          fileFormat: "PNG",
          dimensions: "1024x1024px",
          iconName: baseAsset.iconName,
          category: baseAsset.category
        });
      });
    });

    assets.forEach(asset => {
      const id = this.currentAssetId++;
      const digitalAsset: DigitalAsset = { ...asset, id, isActive: true, category: asset.category || "logistics" };
      this.digitalAssets.set(id, digitalAsset);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllDigitalAssets(): Promise<DigitalAsset[]> {
    return Array.from(this.digitalAssets.values()).filter(asset => asset.isActive);
  }

  async getDigitalAsset(id: number): Promise<DigitalAsset | undefined> {
    return this.digitalAssets.get(id);
  }

  async createDigitalAsset(insertAsset: InsertDigitalAsset): Promise<DigitalAsset> {
    const id = this.currentAssetId++;
    const asset: DigitalAsset = { ...insertAsset, id, isActive: true, category: insertAsset.category || "logistics" };
    this.digitalAssets.set(id, asset);
    return asset;
  }
}

export const storage = new MemStorage();
