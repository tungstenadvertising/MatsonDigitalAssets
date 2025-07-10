import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";
import fs from "fs";

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

      // Map asset IDs to their actual image files
      const assetImages: Record<number, string> = {
        // Door Status Indicator versions
        1: "Fichier 2_1752113567375.png", // Icon Only
        2: "Fichier 11_1752113567375.png", // With Text (Transparent)
        3: "Door status_1752113567375.png", // With Text (Solid)
        
        // Internal Temperature Monitor versions
        4: "Fichier 3-1_1752111955845.png", // Icon Only
        5: "Fichier 10_1752111955845.png", // With Text (Transparent)
        6: "Internal Temperature_1752111955845.png", // With Text (Solid)
        
        // GPS Location Tracker versions
        7: "Fichier 6_1752112713446.png", // Icon Only
        8: "Fichier 7_1752112713445.png", // With Text (Transparent)
        9: "Matson GPS Location_1752112713446.png", // With Text (Solid)
        
        // Journey & Distance Tracker versions
        10: "Fichier 5-1_1752112854438.png", // Icon Only
        11: "Fichier 8_1752112854439.png", // With Text (Transparent)
        12: "Matson Trip Mileage_1752112854439.png", // With Text (Solid)
        
        // Cargo Status Indicator versions
        13: "Fichier 1_1752113164506.png", // Icon Only
        14: "Fichier 12_1752113164506.png", // With Text (Transparent)
        15: "Loaded or Empty_1752113164506.png", // With Text (Solid)
        
        // Motion Alert System versions
        16: "Fichier 4_1752113313600.png", // Icon Only
        17: "Fichier 9_1752113313600.png", // With Text (Transparent)
        18: "Motion Alert_1752113313600.png", // With Text (Solid)
      };

      const imageFile = assetImages[assetId];
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
      
      // Create zip archive
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      // Handle archive errors
      archive.on('error', (err) => {
        console.error('Archive error:', err);
        res.status(500).json({ message: "Failed to create archive" });
      });

      // Pipe archive to response
      archive.pipe(res);

      // Asset image mapping (same as individual download)
      const assetImages: Record<number, string> = {
        // Door Status Indicator versions
        1: "Fichier 2_1752113567375.png", // Icon Only
        2: "Fichier 11_1752113567375.png", // With Text (Transparent)
        3: "Door status_1752113567375.png", // With Text (Solid)
        
        // Internal Temperature Monitor versions
        4: "Fichier 3-1_1752111955845.png", // Icon Only
        5: "Fichier 10_1752111955845.png", // With Text (Transparent)
        6: "Internal Temperature_1752111955845.png", // With Text (Solid)
        
        // GPS Location Tracker versions
        7: "Fichier 6_1752112713446.png", // Icon Only
        8: "Fichier 7_1752112713445.png", // With Text (Transparent)
        9: "Matson GPS Location_1752112713446.png", // With Text (Solid)
        
        // Journey & Distance Tracker versions
        10: "Fichier 5-1_1752112854438.png", // Icon Only
        11: "Fichier 8_1752112854439.png", // With Text (Transparent)
        12: "Matson Trip Mileage_1752112854439.png", // With Text (Solid)
        
        // Cargo Status Indicator versions
        13: "Fichier 1_1752113164506.png", // Icon Only
        14: "Fichier 12_1752113164506.png", // With Text (Transparent)
        15: "Loaded or Empty_1752113164506.png", // With Text (Solid)
        
        // Motion Alert System versions
        16: "Fichier 4_1752113313600.png", // Icon Only
        17: "Fichier 9_1752113313600.png", // With Text (Transparent)
        18: "Motion Alert_1752113313600.png", // With Text (Solid)
      };

      // Organize assets by version type
      const versionFolders = {
        "Icon Only": assets.filter(asset => asset.name.includes("Icon Only")),
        "With Text (Transparent)": assets.filter(asset => asset.name.includes("With Text (Transparent)")),
        "With Text (Solid Background)": assets.filter(asset => asset.name.includes("With Text (Solid Background)"))
      };

      // Add files to archive organized by folders
      for (const [folderName, folderAssets] of Object.entries(versionFolders)) {
        for (const asset of folderAssets) {
          const imageFile = assetImages[asset.id];
          if (imageFile) {
            const imagePath = path.join(__dirname, '../attached_assets', imageFile);
            
            // Check if file exists, if not use placeholder
            if (fs.existsSync(imagePath)) {
              archive.file(imagePath, { 
                name: `${folderName}/${asset.filename}` 
              });
            } else {
              // Create a text file indicating the asset
              const placeholderContent = `${asset.name}\n\nThis asset would be: ${imageFile}\nFile format: ${asset.fileFormat}\nDimensions: ${asset.dimensions}`;
              archive.append(placeholderContent, { 
                name: `${folderName}/${asset.filename.replace('.png', '.txt')}` 
              });
            }
          }
        }
      }

      // Finalize archive
      archive.finalize();
      
    } catch (error) {
      console.error('Download all error:', error);
      res.status(500).json({ message: "Failed to download all assets" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
