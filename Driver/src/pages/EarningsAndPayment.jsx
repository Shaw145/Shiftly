import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaCalendarAlt,
  FaCreditCard,
  FaDownload,
  FaFileInvoice,
  FaHistory,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaExclamationCircle,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { useDriverAuth } from "../context/DriverAuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Demo data - can be removed later
const demoEarnings = {
  totalEarnings: 2845.5,
  pendingPayout: 785.25,
  weeklyEarnings: 623.75,
  trend: "+12.4%",
  completedTrips: 28,
  cancelledTrips: 2,
  activeBookings: 3,
};

const demoTransactions = [
  {
    id: "TR7893452",
    amount: 125.0,
    status: "Paid",
    date: "2023-05-15",
    bookingId: "BK78945612",
    customerName: "John Smith",
    paymentMethod: "Direct Deposit",
    description: "Delivery from New York to Boston",
    type: "earning",
  },
  {
    id: "TR7893453",
    amount: 98.5,
    status: "Paid",
    date: "2023-05-10",
    bookingId: "BK45678923",
    customerName: "Emily Johnson",
    paymentMethod: "Direct Deposit",
    description: "Local delivery within Chicago",
    type: "earning",
  },
  {
    id: "TR7893454",
    amount: 185.75,
    status: "Pending",
    date: "2023-05-08",
    bookingId: "BK12378945",
    customerName: "Michael Brown",
    paymentMethod: "Pending",
    description: "Delivery from Los Angeles to San Diego",
    type: "earning",
  },
  {
    id: "TR7893455",
    amount: 45.0,
    status: "Paid",
    date: "2023-05-05",
    bookingId: "BK78912345",
    customerName: "Sarah Williams",
    paymentMethod: "Direct Deposit",
    description: "Small package delivery in Austin",
    type: "earning",
  },
  {
    id: "TR7893456",
    amount: 15.0,
    status: "Paid",
    date: "2023-05-02",
    bookingId: null,
    customerName: null,
    paymentMethod: "Service Fee",
    description: "Monthly platform service fee",
    type: "deduction",
  },
  {
    id: "TR7893457",
    amount: 230.25,
    status: "Pending",
    date: "2023-04-28",
    bookingId: "BK56789012",
    customerName: "David Martinez",
    paymentMethod: "Pending",
    description: "Long distance delivery to Miami",
    type: "earning",
  },
  {
    id: "TR7893458",
    amount: 85.5,
    status: "Paid",
    date: "2023-04-25",
    bookingId: "BK34567890",
    customerName: "Jennifer Taylor",
    paymentMethod: "Direct Deposit",
    description: "Urgent delivery in Philadelphia",
    type: "earning",
  },
  {
    id: "TR7893459",
    amount: 150.0,
    status: "Processing",
    date: "2023-04-20",
    bookingId: "BK23456789",
    customerName: "Robert Anderson",
    paymentMethod: "Processing",
    description: "Furniture transport to Washington DC",
    type: "earning",
  },
  {
    id: "TR7893460",
    amount: 12.5,
    status: "Paid",
    date: "2023-04-18",
    bookingId: null,
    customerName: null,
    paymentMethod: "Transaction Fee",
    description: "Payment processing fee",
    type: "deduction",
  },
  {
    id: "TR7893461",
    amount: 95.0,
    status: "Paid",
    date: "2023-04-15",
    bookingId: "BK12345678",
    customerName: "Lisa Garcia",
    paymentMethod: "Direct Deposit",
    description: "Retail delivery in Seattle",
    type: "earning",
  },
];

// Demo chart data - weekly earnings
const weeklyChartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Current Week"],
  datasets: [
    {
      label: "Weekly Earnings",
      data: [450, 580, 490, 610, 623.75],
      borderColor: "#FF5757",
      backgroundColor: "rgba(255, 87, 87, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

// Demo chart data - monthly earnings
const monthlyChartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Monthly Earnings",
      data: [
        1280, 1450, 1860, 2150, 2350, 1950, 2250, 2560, 2150, 2450, 2650,
        2845.5,
      ],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

// Demo payment methods
const demoPaymentMethods = [
  {
    id: 1,
    type: "Bank Account",
    name: "Chase Bank",
    accountNumber: "****6789",
    isDefault: true,
    dateAdded: "2023-01-15",
  },
  {
    id: 2,
    type: "Card",
    name: "Visa Debit",
    accountNumber: "****4532",
    isDefault: false,
    dateAdded: "2023-02-28",
  },
];

const EarningsAndPayment = () => {
  const { driverId } = useDriverAuth();
  const [earnings, setEarnings] = useState(demoEarnings);
  const [transactions, setTransactions] = useState(demoTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState(demoTransactions);
  const [paymentMethods, setPaymentMethods] = useState(demoPaymentMethods);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("earnings");
  const [chartPeriod, setChartPeriod] = useState("weekly");
  const [filter, setFilter] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `$${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Fetch driver earnings and transactions (simulated API call)
  useEffect(() => {
    setLoading(true);

    // Simulating API call
    setTimeout(() => {
      setEarnings(demoEarnings);
      setTransactions(demoTransactions);
      setFilteredTransactions(demoTransactions);
      setLoading(false);
    }, 800);
  }, [driverId]);

  // Filter transactions based on selection
  useEffect(() => {
    let results = [...transactions];

    if (filter !== "all") {
      results = results.filter((transaction) => {
        if (filter === "paid") return transaction.status === "Paid";
        if (filter === "pending") return transaction.status === "Pending";
        if (filter === "earnings") return transaction.type === "earning";
        if (filter === "deductions") return transaction.type === "deduction";
        return true;
      });
    }

    setFilteredTransactions(results);
  }, [filter, transactions]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate last payout date
  const getLastPayoutDate = () => {
    const paidTransactions = transactions.filter((t) => t.status === "Paid");
    if (paidTransactions.length === 0) return "No payouts yet";

    const sortedTransactions = [...paidTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return formatDate(sortedTransactions[0].date);
  };

  // Generate invoice
  const generateInvoice = (transaction) => {
    // This would connect to backend API to generate an invoice PDF
    console.log("Generating invoice for transaction:", transaction.id);
    alert(`Invoice for ${transaction.id} would be generated here`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-body-dark"
            >
              Earnings & Payment
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 mt-2"
            >
              Track your earnings, manage payouts and payment methods
            </motion.p>
          </div>

          {/* Main Tabs */}
          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium text-sm md:text-base ${
                  activeTab === "earnings"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                } mr-4 cursor-pointer focus:outline-none transition-colors`}
                onClick={() => setActiveTab("earnings")}
              >
                Earnings Overview
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm md:text-base ${
                  activeTab === "transactions"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                } mr-4 cursor-pointer focus:outline-none transition-colors`}
                onClick={() => setActiveTab("transactions")}
              >
                Transaction History
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm md:text-base ${
                  activeTab === "payment-methods"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                } cursor-pointer focus:outline-none transition-colors`}
                onClick={() => setActiveTab("payment-methods")}
              >
                Payment Methods
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Earnings Overview Tab */}
          {!loading && activeTab === "earnings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Earnings Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Earnings Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-primary">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        Total Earnings
                      </h3>
                      <p className="mt-1 text-3xl font-bold text-body-dark">
                        {formatCurrency(earnings.totalEarnings)}
                      </p>
                    </div>
                    <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                      <FaMoneyBillWave className="text-2xl text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <FaArrowUp className="text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-500">
                      {earnings.trend} this month
                    </span>
                  </div>
                </div>

                {/* Available for Payout Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        Available for Payout
                      </h3>
                      <p className="mt-1 text-3xl font-bold text-body-dark">
                        {formatCurrency(earnings.pendingPayout)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
                      <FaCreditCard className="text-2xl text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
                    <span>Last payout: {getLastPayoutDate()}</span>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Weekly Earnings Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        This Week
                      </h3>
                      <p className="mt-1 text-3xl font-bold text-body-dark">
                        {formatCurrency(earnings.weeklyEarnings)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
                      <FaChartLine className="text-2xl text-green-500" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <FaTruck className="text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        {earnings.completedTrips} trips
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaExclamationCircle className="text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        {earnings.cancelledTrips} cancelled
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Chart Section */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-bold text-body-dark">
                    Earnings Analytics
                  </h2>

                  <div className="mt-3 sm:mt-0 flex border rounded-lg overflow-hidden">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        chartPeriod === "weekly"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } cursor-pointer transition-colors`}
                      onClick={() => setChartPeriod("weekly")}
                    >
                      Weekly
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        chartPeriod === "monthly"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } cursor-pointer transition-colors`}
                      onClick={() => setChartPeriod("monthly")}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Chart Container with Fixed Height */}
                <div className="w-full h-64 sm:h-80">
                  <Line
                    data={
                      chartPeriod === "weekly"
                        ? weeklyChartData
                        : monthlyChartData
                    }
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Active Trips Section - Could be expanded in future */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-body-dark mb-4">
                  Active Bookings
                </h2>

                <div className="text-center py-8">
                  <p className="text-gray-600">
                    You have {earnings.activeBookings} active bookings that will
                    be added to your earnings upon completion.
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                    onClick={() => navigate("/my-bookings")}
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Transaction History Tab */}
          {!loading && activeTab === "transactions" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl font-bold text-body-dark">
                    Transaction History
                  </h2>

                  {/* Filter Controls */}
                  <div className="mt-4 sm:mt-0 relative">
                    <div className="flex items-center">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaFilter className="text-gray-400" />
                      </div>
                      <select
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer w-full sm:w-auto"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All Transactions</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="earnings">Earnings Only</option>
                        <option value="deductions">Deductions Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Transaction ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {transaction.description}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                transaction.type === "earning"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "earning" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                className="text-primary hover:text-primary-dark mr-3 cursor-pointer"
                                onClick={() => generateInvoice(transaction)}
                                title="Download Invoice"
                              >
                                <FaDownload />
                              </button>
                              {transaction.bookingId && (
                                <button
                                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                  onClick={() =>
                                    navigate(
                                      `/booking/${transaction.bookingId}`
                                    )
                                  }
                                  title="View Booking"
                                >
                                  <FaFileInvoice />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Cards for Transactions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Total Paid */}
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Paid</p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatCurrency(
                          transactions
                            .filter(
                              (t) => t.status === "Paid" && t.type === "earning"
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <FaCheckCircle className="text-xl text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Pending Payments */}
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatCurrency(
                          transactions
                            .filter(
                              (t) =>
                                t.status === "Pending" && t.type === "earning"
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <FaHistory className="text-xl text-yellow-600" />
                    </div>
                  </div>
                </div>

                {/* Total Deductions */}
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Deductions</p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatCurrency(
                          transactions
                            .filter((t) => t.type === "deduction")
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <FaArrowDown className="text-xl text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Total Transactions */}
                <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Transactions</p>
                      <p className="text-xl font-bold text-gray-800">
                        {transactions.length}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaFileInvoice className="text-xl text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Methods Tab */}
          {!loading && activeTab === "payment-methods" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-body-dark">
                    Your Payment Methods
                  </h2>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                    onClick={() =>
                      alert("Add payment method dialog would appear here")
                    }
                  >
                    Add New
                  </button>
                </div>

                <div className="space-y-6">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                    >
                      <div className="flex items-center mb-3 sm:mb-0">
                        <div className="p-3 bg-gray-100 rounded-full mr-4">
                          <FaCreditCard className="text-xl text-gray-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {method.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {method.accountNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            Added on {formatDate(method.dateAdded)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Default
                          </span>
                        )}
                        <button
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            alert(`Edit payment method ${method.id}`)
                          }
                        >
                          Edit
                        </button>
                        {!method.isDefault && (
                          <button
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                              alert(`Set ${method.name} as default`)
                            }
                          >
                            Set as Default
                          </button>
                        )}
                        {!method.isDefault && (
                          <button
                            className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 cursor-pointer"
                            onClick={() => alert(`Remove ${method.name}`)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Information and Details */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-body-dark mb-6">
                  Payment Information
                </h2>

                <div className="space-y-6">
                  {/* Payment Schedule */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Payment Schedule
                    </h3>
                    <p className="text-blue-700">
                      Payments are processed every Monday for the previous
                      week's completed deliveries. It typically takes 1-3
                      business days for the funds to reflect in your account.
                    </p>
                  </div>

                  {/* Payment Requirements */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                      Requirements
                    </h3>
                    <p className="text-amber-700 mb-2">
                      To receive payments, please ensure:
                    </p>
                    <ul className="list-disc list-inside text-amber-700 space-y-1">
                      <li>Your account details are up to date</li>
                      <li>You have completed your tax information</li>
                      <li>Your driver profile is fully verified</li>
                    </ul>
                  </div>

                  {/* Tax Information */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Tax Documents
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Your 1099 forms will be available by January 31st each
                        year
                      </p>
                    </div>
                    <button
                      className="mt-3 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors cursor-pointer"
                      onClick={() => alert("View tax documents")}
                    >
                      View Documents
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Withdrawal Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Withdraw Funds
                </h2>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                      defaultValue={earnings.pendingPayout.toFixed(2)}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Available: {formatCurrency(earnings.pendingPayout)}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name} {method.isDefault ? "(Default)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6 bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                  <p className="flex items-start">
                    <FaExclamationCircle className="text-blue-500 mr-2 mt-0.5" />
                    Withdrawals requested before 2 PM on business days are
                    typically processed within 24 hours.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark cursor-pointer"
                    onClick={() => {
                      alert("Withdrawal request submitted!");
                      setShowPaymentModal(false);
                    }}
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EarningsAndPayment;
