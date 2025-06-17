import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  getNotificationsByUserId,
  updateNotification,
} from "../../../api/notification.api";
import StatsCard from "../../Admin/Notifications/components/StatsCard";
import { useState } from "react";
import FilterTabs from "./components/FilterTabs";
import NotificationsList from "./components/NotificationsList";

export default function ClientNotifications() {
  const userId = "1";
  const {
    data: totalNotifications,
    isLoading: isTotalLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllNotifications"],
    queryFn: () => getNotificationsByUserId(userId),
  });

  const { data: unreadNotifications, isLoading: isUnreadLoading } = useQuery({
    queryKey: ["getUnreadNotifications"],
    queryFn: () => getNotificationsByUserId(userId, { seen: false }),
  });

  const { data: readNotifications, isLoading: isReadLoading } = useQuery({
    queryKey: ["getReadNotifications"],
    queryFn: () => getNotificationsByUserId(userId, { seen: true }),
  });
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, seen }: { id: BigInteger; seen: boolean }) =>
      updateNotification(String(id), { seen: !seen }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
    },
  });
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [selectedIdToDelete, setSelectedIdToDelete] =
  //   useState<BigInteger | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.error("Delete error", err);
    },
  });

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredNotifications =
    totalNotifications?.data?.filter((notification) => {
      if (filter === "all") return true;
      return filter === "unread" ? !notification.seen : notification.seen;
    }) || [];

  return (
    <div>
      {" "}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Thông báo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 my-4">
            Cập nhật những thông báo mới nhất của bạn
          </p>
        </div>

        {(unreadNotifications?.data?.length ?? 0) > 0 && (
          <button
            // onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>
      <StatsCard
        totalLength={isTotalLoading ? 0 : totalNotifications?.data.length || 0}
        totalUnreadLength={
          isUnreadLoading ? 0 : unreadNotifications?.data.length || 0
        }
        totalReadLength={
          isReadLoading ? 0 : readNotifications?.data.length || 0
        }
      />
      <FilterTabs filter={filter} setFilter={setFilter} />
      <NotificationsList
        filteredNotifications={filteredNotifications}
        filter={filter}
        onToggleSeen={(id, seen) => updateMutation.mutate({ id, seen })}
        onDelete={(id) => deleteMutation.mutate(String(id))}
      />
    </div>
  );
}
