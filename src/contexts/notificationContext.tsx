/* eslint-disable react-refresh/only-export-components */
// src/context/NotificationContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { Notification } from "../types/Notification";
import { useQuery } from "@tanstack/react-query";
import { getNotificationsByUserId } from "../api/notification.api";
import { useUser } from "../hooks/useUser";

type NotificationContextType = {
  newNotifications: Notification[];
  isLoading: boolean;
  setChangedNotifications: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [changedNotifications, setChangedNotifications] = useState(false);
  const { userProfile } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["getUnreadNotifications", changedNotifications],
    queryFn: () =>
      getNotificationsByUserId(userProfile?.id ? String(userProfile.id) : "", {
        seen: false,
      }),
  });

  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (data?.data) {
      setNewNotifications(data.data);
    }
  }, [data]);

  return (
    <NotificationContext.Provider
      value={{ newNotifications, isLoading, setChangedNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  return context;
};
