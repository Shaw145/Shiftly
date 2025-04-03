import { createContext, useContext, useState, useCallback } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState("");
  const [userDetails, setUserDetails] = useState(null);

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

  return (
    <ProfileContext.Provider
      value={{
        profileImage,
        userDetails,
        updateProfileImage,
        updateUserDetails,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
