import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaUser,
  FaLock,
  FaTrash,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaWifi,
} from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";
// import { Link } from "react-router-dom";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("email");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [emailForm, setEmailForm] = useState({
    currentPassword: "",
    newEmail: "",
    confirmEmail: "",
  });

  const [usernameForm, setUsernameForm] = useState({
    currentPassword: "",
    newUsername: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "Driver Settings | Account Preferences | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Will implement later
    console.log("Email update form submitted:", emailForm);
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    // Will implement later
    console.log("Username update form submitted:", usernameForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Will implement later
    console.log("Password update form submitted:", passwordForm);
  };

  const handleDeleteAccount = () => {
    // Will implement later
    console.log("Delete account requested");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case "email":
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={emailForm.currentPassword}
                onChange={(e) =>
                  setEmailForm({
                    ...emailForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Email Address
              </label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, newEmail: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Email Address
              </label>
              <input
                type="email"
                value={emailForm.confirmEmail}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, confirmEmail: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
            >
              Update Email
            </button>
          </form>
        );

      case "username":
        return (
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={usernameForm.currentPassword}
                onChange={(e) =>
                  setUsernameForm({
                    ...usernameForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Username
              </label>
              <input
                type="text"
                value={usernameForm.newUsername}
                onChange={(e) =>
                  setUsernameForm({
                    ...usernameForm,
                    newUsername: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
            >
              Update Username
            </button>
          </form>
        );

      case "password":
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPasswords.currentPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPasswords.newPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPasswords.confirmPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
            >
              Update Password
            </button>
          </form>
        );

      case "delete":
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FaExclamationTriangle className="text-red-500 w-5 h-5" />
                <h3 className="text-red-800 font-medium">Warning</h3>
              </div>
              <p className="mt-2 text-sm text-red-700">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>
            </div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Are you absolutely sure? Please type "DELETE" to confirm:
                </p>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Type DELETE to confirm"
                />
                <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 mt-10 md:ml-22 lg:ml-24">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar  */}
              <div className="md:w-72 lg:w-80 bg-gray-100 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="p-4 md:p-6 sticky top-20">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Settings
                  </h2>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveSection("email")}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        activeSection === "email"
                          ? "bg-red-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaEnvelope className="w-5 h-5" />
                      <span className="font-medium">Change Email</span>
                    </button>
                    <button
                      onClick={() => setActiveSection("username")}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        activeSection === "username"
                          ? "bg-red-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaUser className="w-5 h-5" />
                      <span className="font-medium">Update Username</span>
                    </button>
                    <button
                      onClick={() => setActiveSection("password")}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        activeSection === "password"
                          ? "bg-red-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaLock className="w-5 h-5" />
                      <span className="font-medium">Reset Password</span>
                    </button>
                    <button
                      onClick={() => setActiveSection("delete")}
                      className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        activeSection === "delete"
                          ? "bg-red-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FaTrash className="w-5 h-5" />
                      <span className="font-medium">Delete Account</span>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Main Content - Only center content on large screens */}
              <div className="flex-1">
                <div className="p-4 md:p-8 lg:p-10">
                  {/* Section Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {activeSection === "email" && "Change Email Address"}
                      {activeSection === "username" && "Update Username"}
                      {activeSection === "password" && "Reset Password"}
                      {activeSection === "delete" && "Delete Account"}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {activeSection === "email" &&
                        "Update your email address. You'll need to verify the new email."}
                      {activeSection === "username" &&
                        "Choose a new username for your account."}
                      {activeSection === "password" &&
                        "Ensure your account is secure by updating your password."}
                      {activeSection === "delete" &&
                        "Permanently remove your account and all associated data."}
                    </p>
                  </div>

                  {/* Form Section */}
                  <div className="max-w-xl mx-auto w-full">
                    <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                      {renderSection()}
                    </div>
                  </div>               
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
