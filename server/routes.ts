import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all digital assets
  app.get("/api/digital-assets", async (req, res) => {
    try {
      const assets = await storage.getAllDigitalAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch digital assets" });
    }
  });

  // Download individual asset
  app.get("/api/digital-assets/:id/download", async (req, res) => {
    try {
      const assetId = parseInt(req.params.id);
      const asset = await storage.getDigitalAsset(assetId);
      
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      // In a real implementation, this would serve the actual file
      // For now, we'll create a mock PNG file response
      const assetImages = {
        1: "PastedGraphic-5_1752023080506.png", // Door Status -> Door graphic
        2: "PastedGraphic-3_1752023080506.png", // Internal Temp -> Temperature graphic
        3: "PastedGraphic-1-2_1752023080506.png", // GPS Location -> GPS graphic
        4: "PastedGraphic-2-1_1752023080506.png", // Trip Mileage -> Trip graphic
        5: "PastedGraphic-6_1752023080506.png", // Cargo Status -> Loaded/Empty graphic
        6: "PastedGraphic-4_1752023080506.png", // Motion Alert -> Motion graphic
      };

      const imageFile = assetImages[assetId as keyof typeof assetImages];
      if (!imageFile) {
        return res.status(404).json({ message: "Asset file not found" });
      }

      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${asset.filename}"`);
      res.setHeader('Content-Type', 'image/png');
      
      // In a real implementation, you would serve the actual file
      // For now, we'll send a response indicating the download
      res.json({ 
        message: "Download initiated",
        filename: asset.filename,
        assetName: asset.name,
        sourceImage: imageFile
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to download asset" });
    }
  });

  // Download all assets as zip
  app.get("/api/digital-assets/download-all", async (req, res) => {
    try {
      const assets = await storage.getAllDigitalAssets();
      
      // Set headers for zip download
      res.setHeader('Content-Disposition', 'attachment; filename="matson-digital-assets.zip"');
      res.setHeader('Content-Type', 'application/zip');
      
      // In a real implementation, you would create and serve a zip file
      res.json({
        message: "Bulk download initiated",
        assets: assets.map(asset => ({
          id: asset.id,
          filename: asset.filename,
          name: asset.name
        }))
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to download all assets" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
