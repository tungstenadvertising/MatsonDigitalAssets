import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AssetCard from "@/components/asset-card";
import AssetGroupCard from "@/components/asset-group-card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Package, DoorOpen, Thermometer, MapPin, Route, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import React from "react";

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

export default function Home() {
  const { toast } = useToast();
  const [downloadingAll, setDownloadingAll] = useState(false);

  const { data: assets, isLoading } = useQuery<DigitalAsset[]>({
    queryKey: ["/api/digital-assets"],
  });

  // Group assets by base name
  const assetGroups: AssetGroup[] = React.useMemo(() => {
    if (!assets) return [];
    
    const groups: Record<string, AssetGroup> = {};
    
    assets.forEach(asset => {
      const baseName = asset.name.split(' - ')[0];
      if (!groups[baseName]) {
        groups[baseName] = {
          baseName,
          description: asset.description.split(' Icon only')[0].split(' Icon with text')[0],
          iconName: asset.iconName,
          category: asset.category,
          versions: []
        };
      }
      groups[baseName].versions.push(asset);
    });
    
    return Object.values(groups);
  }, [assets]);

  const downloadAllMutation = useMutation({
    mutationFn: async () => {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = '/api/digital-assets/download-all';
      link.download = 'matson-digital-assets.zip';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Download Complete",
        description: "All digital assets have been downloaded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Failed to download all assets. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      await downloadAllMutation.mutateAsync();
      setTimeout(() => setDownloadingAll(false), 2000);
    } catch (error) {
      setDownloadingAll(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-clean-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clean-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Download All Button */}
        <div className="mb-8">
          <Button
            onClick={handleDownloadAll}
            disabled={downloadingAll || downloadAllMutation.isPending}
            className="bg-download-green hover:bg-green-600 text-white font-medium px-6 py-3 shadow-md transition-colors duration-200"
          >
            {downloadingAll ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                All Assets Downloaded
              </>
            ) : downloadAllMutation.isPending ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Preparing Download...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download All Assets
              </>
            )}
          </Button>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 gap-8">
          {assetGroups.map((group) => (
            <AssetGroupCard key={group.baseName} group={group} />
          ))}
        </div>


      </main>
      
      <Footer />
    </div>
  );
}
