import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProfile } from "../api/user.api";
import type { UserResponse } from "../types/User";
import { UserContext } from "./userContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [userChanged, setUserChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile();
        console.log("user", response);
        if (response) {
          setUserProfile(response);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
      } finally {
        setUserChanged(false);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userChanged]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        userChanged,
        setUserChanged,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
