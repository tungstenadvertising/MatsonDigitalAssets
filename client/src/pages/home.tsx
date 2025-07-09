import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AssetCard from "@/components/asset-card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";
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

export default function Home() {
  const { toast } = useToast();
  const [downloadingAll, setDownloadingAll] = useState(false);

  const { data: assets, isLoading } = useQuery<DigitalAsset[]>({
    queryKey: ["/api/digital-assets"],
  });

  const downloadAllMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("GET", "/api/digital-assets/download-all");
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
        {/* Page Title and Description */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold corporate-navy mb-4">
            PowerPoint Presentation Assets
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Access and download professional digital assets for your PowerPoint presentations. 
            These standardized graphics ensure consistent branding across all Matson Logistics 
            internal communications and presentations.
          </p>
        </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {assets?.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>

        {/* Usage Guidelines */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold corporate-navy mb-3">Usage Guidelines</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>These assets are optimized for PowerPoint presentations and maintain quality at various sizes</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>All graphics follow Matson Logistics brand standards and color guidelines</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>For questions about additional assets or customization, contact the Brand Team</span>
            </li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
