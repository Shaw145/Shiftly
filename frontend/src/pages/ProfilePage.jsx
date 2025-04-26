import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  FaCamera,
  FaEdit,
  FaSpinner,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
  FaPlus,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import EditModal from "../components/profile/EditModal";
import AddressModal from "../components/profile/AddressModal";
import ImageViewModal from "../components/profile/ImageViewModal";
import { useProfile } from "../context/ProfileContext";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    bio: "",
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const { updateProfileImage } = useProfile();

  // Set dynamic page title when component mounts
  useEffect(() => {
    // Update the document title
    document.title = "My Profile | Account Management | Shiftly - A Seamless Transport System";
    
    // Optional: Restore the original title when component unmounts
    return () => {
      document.title = "Shiftly | A Seamless Transport System";
    };
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  // Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Ensure address object exists
        const user = {
          ...data.user,
          address: data.user.address || {
            street: "",
            city: "",
            state: "",
            pincode: "",
          },
        };
        setProfile(user);
        setFormData(user);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show loading state
    setLoading(true);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/upload-photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success && data.user) {
        setProfile(data.user);
        updateProfileImage(data.user.profileImage);
        showToast("Profile photo updated successfully", "success");
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      showToast("Failed to upload image", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/remove-photo`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.user) {
        setProfile(data.user);
        updateProfileImage("");
        showToast("Profile photo removed successfully", "success");
      } else {
        throw new Error(data.error || "Failed to remove image");
      }
    } catch (err) {
      console.error("Error removing image:", err);
      showToast("Failed to remove image", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not added";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async (section, data) => {
    try {
      let updateData = {};

      if (section === "personal") {
        // For personal info section
        updateData = {
          fullName: data.fullName,
          phone: data.phone || "",
          alternatePhone: data.alternatePhone || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString()
            : undefined,
          gender: data.gender || undefined,
        };
      } else if (section === "about") {
        // For about section
        updateData = {
          bio: data.bio || "",
        };
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the profile state with the new data
        setProfile((prev) => ({
          ...prev,
          ...result.user,
        }));
        setShowEditModal(false);
        showToast("Profile updated successfully", "success");
        localStorage.setItem("fullName", result.user.fullName);

        // Refresh the profile data
        await fetchProfile();
      } else {
        showToast(result.error || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("Failed to update profile", "error");
    }
  };

  const handleSaveAddress = async (addressData) => {
    try {
      const newAddresses = [...(profile.addresses || [])];

      // If setting as default, unset default for all other addresses
      if (addressData.isDefault) {
        newAddresses.forEach((addr) => (addr.isDefault = false));
      }

      if (editingAddress) {
        // Find the index of the address being edited
        const index = newAddresses.findIndex(
          (addr) =>
            addr.street === editingAddress.street &&
            addr.pincode === editingAddress.pincode
        );
        if (index !== -1) {
          newAddresses[index] = addressData;
        }
      } else {
        newAddresses.push(addressData);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ addresses: newAddresses }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the profile state with the new data
        setProfile((prev) => ({
          ...prev,
          ...result.user,
        }));
        setShowAddressModal(false);
        setEditingAddress(null);
        showToast("Address saved successfully", "success");

        // Refresh the profile data
        await fetchProfile();
      } else {
        showToast(result.error || "Failed to save address", "error");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      showToast("Failed to save address", "error");
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const newAddresses = profile.addresses.filter((_, i) => i !== index);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ addresses: newAddresses }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setProfile(result.user);
        showToast("Address deleted successfully", "success");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      showToast("Failed to delete address", "error");
    }
  };

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditClick = (section, data = null) => {
    setFormData(data || profile);
    setEditSection(section);
    setShowEditModal(true);
  };

  const openImageModal = () => {
    setShowImageModal(true);
    document.body.classList.add("no-scroll");
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    document.body.classList.remove("no-scroll");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 text-center p-8 rounded-lg max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20 md:ml-22 lg:ml-24">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <FaSpinner className="animate-spin text-red-500 text-4xl" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : profile ? (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="relative min-h-[16rem] bg-gradient-to-r from-red-900 to-blue-900 p-4 sm:p-8">
              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 sm:gap-8 pt-4">
                {/* Profile Image Section */}
                <div className="relative shrink-0">
                  {profile.profileImage ? (
                    <div className="relative">
                      <div className="relative">
                        <div
                          onClick={() => openImageModal()}
                          className="group w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden cursor-pointer"
                        >
                          <img
                            src={profile.profileImage}
                            alt={profile.fullName}
                            className="w-full h-full object-cover"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-white text-sm sm:text-lg font-medium">
                              View Photo
                            </span>
                          </div>
                        </div>
                        {/* Upload Button */}
                        <label className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-red-600 transition-colors duration-300 hover:scale-130 hover:shadow-lg hover:shadow-gray-800">
                          <FaCamera className="w-4 h-4" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg bg-red-100 flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl font-bold text-red-600">
                          {getInitials(profile.fullName)}
                        </span>
                      </div>
                      <label className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-red-600 transition-colors">
                        <FaCamera className="w-4 h-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Name and Username Section */}
                <div className="text-center sm:text-left max-w-full sm:pt-16">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 break-words">
                    {profile.fullName}
                  </h1>
                  <p className="text-gray-300 break-words">
                    @{profile.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info Only */}
            <div className="lg:col-span-1">
              {/* Personal Info Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Info</h2>
                  <button
                    onClick={() => handleEditClick("personal", profile)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-gray-900">{profile.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-gray-900">@{profile.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {profile.phone || "Not added"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Alternate Phone</p>
                      <p className="text-gray-900">
                        {profile.alternatePhone || "Not added"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaBirthdayCake className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-gray-900">
                        {formatDate(profile.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaVenusMars className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-gray-900">
                        {profile.gender || "Not added"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - About and Addresses */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">About</h2>
                  <button
                    onClick={() =>
                      handleEditClick("about", { bio: profile.bio })
                    }
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600">
                  {profile.bio || "No bio added yet"}
                </p>
              </div>

              {/* Addresses Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {profile.addresses?.map((address, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 border rounded-lg hover:border-red-200 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <FaMapMarkerAlt className="text-gray-400 mt-1" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900 font-medium capitalize">
                              {address.type}
                            </span>
                            {address.isDefault && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">
                            {address.street}
                            {address.addressLine2 &&
                              `, ${address.addressLine2}`}
                            {address.landmark && `, ${address.landmark}`}
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingAddress(address);
                            setShowAddressModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(index)}
                          className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          section={editSection}
          data={formData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          address={editingAddress}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
        />
      )}

      {/* Image View Modal */}
      {showImageModal && (
        <ImageViewModal
          image={profile.profileImage}
          fullName={profile.fullName}
          onClose={closeImageModal}
          onDelete={handleRemoveImage}
          onUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

export default ProfilePage;
