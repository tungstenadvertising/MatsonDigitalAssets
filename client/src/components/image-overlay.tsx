import { X } from "lucide-react";
import { useEffect } from "react";

interface ImageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  assetName: string;
  versionLabel: string;
}

export default function ImageOverlay({ 
  isOpen, 
  onClose, 
  imageSrc, 
  imageAlt, 
  assetName, 
  versionLabel 
}: ImageOverlayProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Image container */}
        <div className="flex flex-col">
          <div className="flex items-center justify-center bg-gray-50 min-h-96 p-8">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>
          
          {/* Asset info */}
          <div className="p-6 border-t">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {assetName}
            </h3>
            <p className="text-gray-600 text-sm">
              {versionLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}