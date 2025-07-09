import { User } from "lucide-react";
import tungstenLogo from "@assets/34B7050F-55F6-49E6-BD15-89FEADEC88A1_1_105_c_1752025243605.jpeg";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start h-32">
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

        </div>
      </div>
    </header>
  );
}
