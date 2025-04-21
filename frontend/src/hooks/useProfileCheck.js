import { useState, useEffect } from 'react';

const useProfileCheck = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsProfileComplete(false);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setIsProfileComplete(false);
          setLoading(false);
          return;
        }

        const userData = await response.json();
        
        // Check if user has a phone number
        const hasPhone = userData.user && userData.user.phone && userData.user.phone.trim() !== '';
        
        setUser(userData.user);
        setIsProfileComplete(hasPhone);
        setLoading(false);
      } catch (error) {
        console.error('Error checking profile:', error);
        setIsProfileComplete(false);
        setLoading(false);
      }
    };

    checkProfile();
  }, []);

  return { isProfileComplete, user, loading };
};

export default useProfileCheck;