import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

const LocationMap = ({ pickup, delivery }) => {
  const openInMaps = () => {
    const origin = encodeURIComponent(pickup);
    const destination = encodeURIComponent(delivery);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 flex flex-col h-full min-h-[260px]">
      <h3 className="text-[15px] sm:text-base md:text-lg font-medium text-gray-800 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
        <FaMapMarkedAlt className="text-red-500 text-lg" /> 
        <span>Route Map</span>
      </h3>
      
      <div className="bg-gray-100 rounded-lg flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
        <div className="flex flex-col items-center justify-between h-full w-full">
          <div className="text-center w-full">
            <FaMapMarkedAlt className="text-gray-400 mx-auto mb-2 text-3xl sm:text-4xl" />
            <p className="text-gray-500 text-xs sm:text-sm mb-1">
              Route from:
            </p>
            <div className="space-y-1 max-w-full">
              <p className="font-medium text-gray-700 text-sm sm:text-base line-clamp-2 px-2">
                {pickup}
              </p>
              <p className="text-xs text-gray-500">to</p>
              <p className="font-medium text-gray-700 text-sm sm:text-base line-clamp-2 px-2">
                {delivery}
              </p>
            </div>
          </div>

          <button 
            onClick={openInMaps}
            className="mt-3 w-full max-w-[180px] sm:max-w-[200px] bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm py-2 rounded-lg transition-colors cursor-pointer hover:scale-105 hover:shadow-lg"
          >
            Open in Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;