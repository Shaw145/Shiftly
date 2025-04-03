import { useState } from "react";
import { FaCreditCard, FaLock } from "react-icons/fa";

const PaymentForm = ({ onSubmit, amount, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, method: paymentMethod });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
        <div className="flex items-center text-green-600">
          <FaLock className="mr-2" />
          <span className="text-sm">Secure Payment</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`p-4 rounded-lg border ${
              paymentMethod === "card"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <FaCreditCard className="mx-auto mb-2" />
            <span>Credit/Debit Card</span>
          </button>
          <button
            className={`p-4 rounded-lg border ${
              paymentMethod === "upi"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }`}
            onClick={() => setPaymentMethod("upi")}
          >
            <img
              src="/upi-icon.png"
              alt="UPI"
              className="w-6 h-6 mx-auto mb-2"
            />
            <span>UPI</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {paymentMethod === "card" ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Card Holder Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="John Doe"
                value={formData.cardHolder}
                onChange={(e) =>
                  setFormData({ ...formData, cardHolder: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={formData.expiry}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">CVV</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="123"
                  maxLength="3"
                  value={formData.cvv}
                  onChange={(e) =>
                    setFormData({ ...formData, cvv: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">UPI ID</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="username@upi"
              value={formData.upiId}
              onChange={(e) =>
                setFormData({ ...formData, upiId: e.target.value })
              }
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          } text-white py-4 rounded-lg transition-colors flex items-center justify-center`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Pay ₹${amount}`
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
