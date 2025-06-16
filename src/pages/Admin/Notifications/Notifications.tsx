import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotifications,
  getAllNotifications,
  updateNotification,
} from "../../../api/notification.api";

import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import FilterBar from "./components/FilterBar";
import NotificationList from "./components/NotificationList";
import type { Notification } from "../../../types/Notification";

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRead, setFilterRead] = useState("All");

  const readStatuses = ["All", "Read", "Unread"];

  const {
    data: totalNotifications,
    isLoading: isTotalLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllNotifications"],
    queryFn: () => getAllNotifications(),
  });

  const { data: unreadNotifications, isLoading: isUnreadLoading } = useQuery({
    queryKey: ["getUnreadNotifications"],
    queryFn: () => getAllNotifications({ seen: false }),
  });

  const { data: readNotifications, isLoading: isReadLoading } = useQuery({
    queryKey: ["getReadNotifications"],
    queryFn: () => getAllNotifications({ seen: true }),
  });
  const queryClient = useQueryClient(); // ✅ fix

  const updateMutation = useMutation({
    mutationFn: ({ id, seen }: { id: BigInteger; seen: boolean }) =>
      updateNotification(id, { seen: !seen }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotifications,
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.error("Delete error", err);
    },
  });

  const notifications: Notification[] = totalNotifications?.data || [];

  const filteredNotifications = notifications.filter((noti) => {
    const matchSearch = noti.message
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchRead =
      filterRead === "All" ||
      (filterRead === "Read" && noti.seen) ||
      (filterRead === "Unread" && !noti.seen);

    return matchSearch && matchRead;
  });

  const handleToggleRead = (id: BigInteger, seen: boolean) => {
    updateMutation.mutate({
      id,
      seen: !seen,
    });
  };

  const handleDelete = (id: BigInteger) => {
    deleteMutation.mutate({
      ids: [id],
    });
  };

  return (
    <div className="space-y-6">
      <Header />
      <StatsCard
        totalLength={isTotalLoading ? 0 : notifications.length}
        totalUnreadLength={
          isUnreadLoading ? 0 : unreadNotifications?.data.length || 0
        }
        totalReadLength={
          isReadLoading ? 0 : readNotifications?.data.length || 0
        }
      />
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRead={filterRead}
        setFilterRead={setFilterRead}
        readStatuses={readStatuses}
      />
      <NotificationList
        notifications={filteredNotifications}
        handleToggleRead={(id, seen) => handleToggleRead(id, seen)}
        handleDelete={handleDelete}
      />
    </div>
  );
}
