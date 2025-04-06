import { createContext, useContext, useState, useCallback } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [driverStatus, setDriverStatus] = useState({
    isOnline: false,
    isAvailable: true,
    currentLocation: null,
    vehicleStatus: "active", // active, maintenance, inactive
  });

  const updateProfileImage = useCallback((imageUrl) => {
    setProfileImage(imageUrl);
    setUserDetails((prev) =>
      prev
        ? {
            ...prev,
            profileImage: imageUrl,
          }
        : null
    );
  }, []);

  const updateUserDetails = useCallback((details) => {
    setUserDetails(details);
    setProfileImage(details?.profileImage || "");
  }, []);

  const updateDriverStatus = useCallback((status) => {
    setDriverStatus(prev => ({
      ...prev,
      ...status
    }));
  }, []);

  const updateLocation = useCallback((location) => {
    setDriverStatus(prev => ({
      ...prev,
      currentLocation: location
    }));
  }, []);

  const updateVehicleStatus = useCallback((status) => {
    setDriverStatus(prev => ({
      ...prev,
      vehicleStatus: status
    }));
  }, []);

  // Function to toggle online status
  const toggleOnlineStatus = useCallback(() => {
    setDriverStatus(prev => ({
      ...prev,
      isOnline: !prev.isOnline
    }));
    // Here you would typically make an API call to update the status on the server
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profileImage,
        userDetails,
        driverStatus,
        updateProfileImage,
        updateUserDetails,
        updateDriverStatus,
        updateLocation,
        updateVehicleStatus,
        toggleOnlineStatus,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export default ProfileProvider;