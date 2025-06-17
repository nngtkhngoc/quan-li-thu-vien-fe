import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProfile } from "../api/user.api";
import type { UserResponse } from "../types/User";
import { UserContext } from "./userContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [userChanged, setUserChanged] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
