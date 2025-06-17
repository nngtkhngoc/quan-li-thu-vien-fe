/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  deleteNotifications,
  getNotificationsByUserId,
  updateNotification,
} from "../../../api/notification.api";
import StatsCard from "../../Admin/Notifications/components/StatsCard";
import { useEffect, useState } from "react";
import FilterTabs from "./components/FilterTabs";
import NotificationsList from "./components/NotificationsList";
import type { Notification } from "../../../types/Notification";
import { useNotification } from "../../../contexts/notificationContext";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

export default function ClientNotifications() {
  const userId = "1";
  const { setChangedNotifications } = useNotification();
  const { data: totalNotifications, isLoading: isTotalLoading } = useQuery({
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
      setChangedNotifications(true);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unread = unreadNotifications?.data || [];
      await Promise.all(
        unread.map((noti) =>
          updateNotification(String(noti.id), { seen: true })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      setChangedNotifications(true);
    },
  });

  const [selectedIdsToDelete, setSelectedIdsToDelete] = useState<string[]>([]);

  useEffect(() => {
    if (totalNotifications) {
      const allIds = totalNotifications.data.map((notification: Notification) =>
        notification.id.toString()
      );
      setSelectedIdsToDelete(allIds);
    }
  }, [totalNotifications]);

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
      setChangedNotifications(true);
    },
    onError: (err) => {
      console.error("Delete error", err);
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: (data: { ids: string[] }) => deleteNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
      setChangedNotifications(true);
    },
    onError: (err) => {
      console.error("Delete many error", err);
    },
  });

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredNotifications =
    totalNotifications?.data?.filter((notification) => {
      if (filter === "all") return true;
      return filter === "unread" ? !notification.seen : notification.seen;
    }) || [];

  const isLoading = isReadLoading || isTotalLoading || isUnreadLoading;

  if (isLoading) return <LoadingSpinner size="lg" />;

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

        <div className="flex flex-row gap-2 py-3">
          <button
            onClick={() =>
              deleteAllMutation.mutate({ ids: selectedIdsToDelete })
            }
            disabled={deleteAllMutation.isPending}
            className="disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
          >
            {deleteAllMutation.isPending
              ? "Đang xử lý..."
              : "Xoá tất cả thông báo"}
          </button>

          {(unreadNotifications?.data?.length ?? 0) > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="disabled:bg-gray-500 disabled:cursor-not-allowed px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
            >
              {markAllAsReadMutation.isPending
                ? "Đang xử lý..."
                : "Đánh dấu tất cả đã đọc"}
            </button>
          )}
        </div>
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
