import { FaBox } from "react-icons/fa";

const GoodsSection = ({ booking }) => {
  // Helper function to safely extract goods details
  const safelyGetGoodsData = () => {
    try {
      if (!booking || !booking.goods) {
        return {
          type: "Not specified",
          items: [],
          additionalItems: "",
        };
      }

      // Handle case where goods is a MongoDB document with documents field
      if (booking.goods.documents) {
        console.warn(
          "Found MongoDB document in goods object, using safe values"
        );
        return {
          type: "Not specified",
          items: [],
          additionalItems: "",
        };
      }

      // Extract values with fallbacks
      return {
        type: booking.goods.type || "Not specified",
        items: Array.isArray(booking.goods.items) ? booking.goods.items : [],
        additionalItems: booking.goods.additionalItems || "",
      };
    } catch (error) {
      console.error("Error extracting goods data:", error);
      return {
        type: "Not specified",
        items: [],
        additionalItems: "",
      };
    }
  };

  const goods = safelyGetGoodsData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Goods Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <FaBox className="text-gray-400 text-xl" />
              <span className="font-medium text-gray-900">
                {goods.type
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goods.items &&
                goods.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        {item.weight && (
                          <p className="text-sm text-gray-600">
                            Weight: {item.weight} kg
                          </p>
                        )}
                        {item.note && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {goods.additionalItems && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">
              Additional Items:
            </h4>
            <p className="text-gray-600">{goods.additionalItems}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoodsSection;
