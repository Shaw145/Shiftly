import { FaUser, FaUniversity, FaTruck } from "react-icons/fa";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "personal", label: "Personal Details", icon: FaUser },
    { id: "bank", label: "Bank Details", icon: FaUniversity },
    { id: "vehicle", label: "Vehicle Details", icon: FaTruck },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === id
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon className="text-lg" />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
