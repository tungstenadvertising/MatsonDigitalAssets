export default function Footer() {
  return (
    <footer className="bg-corporate-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg mb-2">TUNGSTEN</div>
            <p className="text-blue-200">Matson Logistics - Digital Asset Library</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">
              © {new Date().getFullYear()} Matson Logistics. All rights reserved.
            </p>
            <p className="text-blue-200 text-sm">Internal Use Only</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
