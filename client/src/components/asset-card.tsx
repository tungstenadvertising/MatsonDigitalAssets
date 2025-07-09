import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, DoorOpen, Thermometer, MapPin, Route, Package, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

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

interface AssetCardProps {
  asset: DigitalAsset;
}

const iconMap = {
  "door-open": DoorOpen,
  "thermometer-half": Thermometer,
  "map-marker-alt": MapPin,
  "route": Route,
  "boxes": Package,
  "exchange-alt": ArrowLeftRight,
};

export default function AssetCard({ asset }: AssetCardProps) {
  const { toast } = useToast();
  const [downloaded, setDownloaded] = useState(false);

  const IconComponent = iconMap[asset.iconName as keyof typeof iconMap] || Package;

  const downloadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("GET", `/api/digital-assets/${asset.id}/download`);
    },
    onSuccess: () => {
      setDownloaded(true);
      toast({
        title: "Download Complete",
        description: `${asset.name} has been downloaded successfully.`,
      });
      setTimeout(() => setDownloaded(false), 2000);
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: `Failed to download ${asset.name}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-professional-blue rounded-lg flex items-center justify-center shadow-sm">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold corporate-navy mb-2">
            {asset.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {asset.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {asset.fileFormat} Format • {asset.dimensions}
            </span>
            <Button
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                downloaded
                  ? "bg-download-green hover:bg-green-600 text-white"
                  : "bg-action-blue hover:bg-cyan-600 text-white"
              }`}
            >
              {downloaded ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Downloaded
                </>
              ) : downloadMutation.isPending ? (
                <>
                  <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
