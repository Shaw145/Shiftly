import { FaBox } from "react-icons/fa";

const GoodsSection = ({ booking }) => {
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
                {booking.goods.type
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.goods.items.map((item, index) => (
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

        {booking.goods.additionalItems && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">
              Additional Items:
            </h4>
            <p className="text-gray-600">{booking.goods.additionalItems}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoodsSection;
