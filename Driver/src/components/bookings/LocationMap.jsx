import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

// This is a placeholder component for the map functionality
// In a real implementation, this would use a mapping library like Google Maps or Mapbox
const LocationMap = ({ pickup, destination }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
        <FaMapMarkedAlt className="text-red-500" /> Route Map
      </h3>
      
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center">
          <FaMapMarkedAlt className="text-gray-400 text-4xl mx-auto mb-3" />
          <p className="text-gray-500 mb-1">Map showing route from:</p>
          <p className="font-medium text-gray-700">{pickup} to {destination}</p>
          <button className="mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition cursor-pointer">
            Open in Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;