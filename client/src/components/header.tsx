import { User } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-corporate-navy text-white px-4 py-2 rounded font-bold text-lg">
                TUNGSTEN
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-semibold corporate-navy">
                Digital Asset Library
              </h1>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Matson Logistics Staff Portal
            </span>
            <User className="w-5 h-5 professional-blue" />
          </div>
        </div>
      </div>
    </header>
  );
}
