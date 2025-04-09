import {
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaUpload,
} from "react-icons/fa";

const DocumentUploadCard = ({
  title,
  number,
  status,
  file,
  onNumberChange,
  onFileChange,
  isEditing,
  hideNumber = false,
  acceptedFileTypes = ".pdf",
  fileTypeLabel = "Upload Document (PDF)",
}) => {
  const getStatusBadge = () => {
    const getTooltipMessage = () => {
      switch (status) {
        case "verified":
          return "Document has been verified";
        case "verifying":
          return "Document is under verification";
        default:
          return "Document upload pending";
      }
    };

    switch (status) {
      case "verified":
        return (
          <div className="relative group">
            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1 cursor-pointer">
              <FaCheck className="text-green-500" /> Verified
            </span>
            <div className="absolute hidden group-hover:block w-48 bg-red-600/90 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 right-0 top-full mt-2 shadow-xl z-10">
              {getTooltipMessage()}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900/90 rotate-45"></div>
            </div>
          </div>
        );
      case "verifying":
        return (
          <div className="relative group">
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1 cursor-pointer">
              <FaSpinner className="text-yellow-500 animate-spin" /> Verifying
            </span>
            <div className="absolute hidden group-hover:block w-48 bg-red-600/90 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 right-0 top-full mt-2 shadow-xl z-10">
              {getTooltipMessage()}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900/90 rotate-45"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative group">
            <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1 cursor-pointer">
              <FaExclamationTriangle className="text-gray-500" /> Pending
            </span>
            <div className="absolute hidden group-hover:block w-48 bg-red-600/90 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 right-0 top-full mt-2 shadow-xl z-10">
              {getTooltipMessage()}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900/90 rotate-45"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        {getStatusBadge()}
      </div>

      {!hideNumber && (
        <input
          type="text"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
          placeholder={`Enter ${title} Number`}
        />
      )}

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">{fileTypeLabel}</label>
        <div className="relative">
          <input
            type="file"
            accept={acceptedFileTypes}
            onChange={(e) => onFileChange(e.target.files[0])}
            disabled={!isEditing}
            className="hidden"
            id={`file-${title}`}
          />
          <label
            htmlFor={`file-${title}`}
            className={`w-full px-4 py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              isEditing
                ? "border-red-300 hover:border-red-500 text-red-500 hover:bg-red-50"
                : "border-gray-300 text-gray-400"
            }`}
          >
            <FaUpload className="text-lg" />
            {file ? file.name : "Upload File"}
          </label>
        </div>
        <p className="text-xs text-gray-500">Maximum file size: 2MB</p>
      </div>
    </div>
  );
};

export default DocumentUploadCard;
