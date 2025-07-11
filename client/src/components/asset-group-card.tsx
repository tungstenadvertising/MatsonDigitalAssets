import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, DoorOpen, Thermometer, MapPin, Route, Package, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import ImageOverlay from "./image-overlay";

// Import actual asset images
import doorStatusIcon from "@assets/Fichier 2_1752113567375.png";
import doorStatusTransparent from "@assets/Fichier 11_1752113567375.png"; 
import doorStatusSolid from "@assets/Door status_1752113567375.png";
import tempIcon from "@assets/Fichier 3-1_1752111955845.png";
import tempTransparent from "@assets/Fichier 10_1752111955845.png";
import tempSolid from "@assets/Internal Temperature_1752111955845.png";
import gpsIcon from "@assets/Fichier 6_1752112713446.png";
import gpsTransparent from "@assets/Fichier 7_1752112713445.png";
import gpsSolid from "@assets/Matson GPS Location_1752112713446.png";
import journeyIcon from "@assets/Fichier 5-1_1752112854438.png";
import journeyTransparent from "@assets/Fichier 8_1752112854439.png";
import journeySolid from "@assets/Matson Trip Mileage_1752112854439.png";
import cargoIcon from "@assets/Fichier 1_1752113164506.png";
import cargoTransparent from "@assets/Fichier 12_1752113164506.png";
import cargoSolid from "@assets/Loaded or Empty_1752113164506.png";
import motionIcon from "@assets/Fichier 4_1752113313600.png";
import motionTransparent from "@assets/Fichier 9_1752113313600.png";
import motionSolid from "@assets/Motion Alert_1752113313600.png";

interface DigitalAsset {
  id: number;
  name: string;
  description: string;
  filename: string;
  fileFormat: string;
  dimensions: string;
  iconName: string;
  category: string;
  isActive: boolean;
}

interface AssetGroup {
  baseName: string;
  description: string;
  iconName: string;
  category: string;
  versions: DigitalAsset[];
}

interface AssetGroupCardProps {
  group: AssetGroup;
}

const iconMap = {
  "door-open": DoorOpen,
  "thermometer-half": Thermometer,
  "map-marker-alt": MapPin,
  "route": Route,
  "boxes": Package,
  "exchange-alt": ArrowLeftRight,
};

const versionLabels = [
  { label: "Icon Only", description: "No text, transparent background" },
  { label: "With Text (Transparent)", description: "Text on transparent background" },
  { label: "With Text (Solid)", description: "Text on solid background" }
];

// Asset image mapping
const assetImages: Record<string, string[]> = {
  "Door Status Indicator": [doorStatusIcon, doorStatusTransparent, doorStatusSolid],
  "Internal Temperature Monitor": [tempIcon, tempTransparent, tempSolid],
  "GPS Location Tracker": [gpsIcon, gpsTransparent, gpsSolid],
  "Journey & Distance Tracker": [journeyIcon, journeyTransparent, journeySolid],
  "Cargo Status Indicator": [cargoIcon, cargoTransparent, cargoSolid],
  "Motion Alert System": [motionIcon, motionTransparent, motionSolid],
};

export default function AssetGroupCard({ group }: AssetGroupCardProps) {
  const { toast } = useToast();
  const [downloadingStates, setDownloadingStates] = useState<Record<number, boolean>>({});
  const [downloadedStates, setDownloadedStates] = useState<Record<number, boolean>>({});
  const [overlayImage, setOverlayImage] = useState<{
    src: string;
    alt: string;
    assetName: string;
    versionLabel: string;
  } | null>(null);

  const IconComponent = iconMap[group.iconName as keyof typeof iconMap] || Package;

  const downloadMutation = useMutation({
    mutationFn: async (assetId: number) => {
      // Add a small delay to allow downloading state to show
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = `/api/digital-assets/${assetId}/download`;
      link.download = ''; // Let the server determine the filename
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    },
    onSuccess: (data, assetId) => {
      const asset = group.versions.find(v => v.id === assetId);
      
      // Show completed state after a brief delay
      setTimeout(() => {
        setDownloadingStates(prev => ({ ...prev, [assetId]: false }));
        setDownloadedStates(prev => ({ ...prev, [assetId]: true }));
        toast({
          title: "Download Started",
          description: `${asset?.name} download has started.`,
        });
        
        // Reset completed state after 2 seconds
        setTimeout(() => {
          setDownloadedStates(prev => ({ ...prev, [assetId]: false }));
        }, 2000);
      }, 200);
    },
    onError: (error, assetId) => {
      const asset = group.versions.find(v => v.id === assetId);
      setDownloadingStates(prev => ({ ...prev, [assetId]: false }));
      toast({
        title: "Download Failed",
        description: `Failed to download ${asset?.name}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleDownload = (assetId: number) => {
    setDownloadingStates(prev => ({ ...prev, [assetId]: true }));
    downloadMutation.mutate(assetId);
  };

  const handleImageClick = (imageSrc: string, assetName: string, versionLabel: string) => {
    setOverlayImage({
      src: imageSrc,
      alt: `${assetName} - ${versionLabel}`,
      assetName,
      versionLabel
    });
  };

  const closeOverlay = () => {
    setOverlayImage(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-professional-blue rounded-lg flex items-center justify-center shadow-sm">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold corporate-navy mb-2">
            {group.baseName}
          </h3>
          <p className="text-gray-600 mb-4">
            {group.description}
          </p>
        </div>
      </div>

      {/* Three Versions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {group.versions.slice(0, 3).map((version, index) => {
          const isDownloading = downloadingStates[version.id];
          const isDownloaded = downloadedStates[version.id];
          
          return (
            <div key={version.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="text-center mb-3">
                <div 
                  className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2 overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    if (assetImages[group.baseName]?.[index]) {
                      handleImageClick(
                        assetImages[group.baseName][index],
                        group.baseName,
                        versionLabels[index]?.label || `Version ${index + 1}`
                      );
                    }
                  }}
                >
                  {assetImages[group.baseName]?.[index] ? (
                    <img 
                      src={assetImages[group.baseName][index]} 
                      alt={`${group.baseName} - ${versionLabels[index]?.label}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <IconComponent className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  {versionLabels[index]?.label || `Version ${index + 1}`}
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  {versionLabels[index]?.description || ""}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">
                  {version.fileFormat} • {version.dimensions}
                </div>
                <Button
                  onClick={() => handleDownload(version.id)}
                  disabled={isDownloading}
                  className={`w-full text-xs py-2 px-3 transition-colors duration-200 ${
                    isDownloaded
                      ? "bg-download-green hover:bg-green-600 text-white"
                      : "bg-action-blue hover:bg-cyan-600 text-white"
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Downloaded
                    </>
                  ) : isDownloading ? (
                    <>
                      <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Overlay */}
      {overlayImage && (
        <ImageOverlay
          isOpen={!!overlayImage}
          onClose={closeOverlay}
          imageSrc={overlayImage.src}
          imageAlt={overlayImage.alt}
          assetName={overlayImage.assetName}
          versionLabel={overlayImage.versionLabel}
        />
      )}
    </div>
  );
}