import { User } from "lucide-react";
import tungstenLogo from "@assets/34B7050F-55F6-49E6-BD15-89FEADEC88A1_1_105_c_1752025243605.jpeg";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-32">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src={tungstenLogo} 
                alt="TUNGSTEN" 
                className="h-32 w-auto object-contain"
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="flex-1 text-center ml-8">
            <h2 className="text-3xl font-bold corporate-navy mb-2">
              PowerPoint Presentation Assets
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access and download digital assets for your PowerPoint presentations. 
              These standardized graphics ensure consistent branding across all Matson Logistics 
              internal communications and presentations.
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}
