import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FaSpinner className="animate-spin text-4xl text-red-500 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
