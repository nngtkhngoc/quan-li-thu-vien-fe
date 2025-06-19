import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  updateNotification,
} from "../../../api/notification.api";

import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import FilterBar from "./components/FilterBar";
import NotificationList from "./components/NotificationList";
import type { Notification } from "../../../types/Notification";
import DeleteConfirmModal from "./components/DeleteModal";
import CreateNotificationModal from "./components/CreateModal";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { toast } from "react-toastify";

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRead, setFilterRead] = useState("All");

  const readStatuses = ["All", "Read", "Unread"];

  const { data: totalNotifications, isLoading: isTotalLoading } = useQuery({
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
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, seen }: { id: BigInteger; seen: boolean }) =>
      updateNotification(String(id), { seen: !seen }), // Ép kiểu về string ở đây
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
    },
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(
    null
  );

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
      toast.success("Xóa thông báo thành công!");
      setShowDeleteModal(false);
    },
    onError: (err) => {
      console.error("Delete error", err);
      toast.error("Xóa thông báo thất bại!");
    },
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const createMutation = useMutation({
    mutationFn: ({ userId, message }: { userId: number; message: string }) =>
      createNotification({ user_id: userId, message }),
    onSuccess: () => {
      toast.success("Tạo thông báo thành công!");
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getAllNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getReadNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["getUnreadNotifications"] });
      setShowCreateModal(false);
    },
    onError: (err) => {
      toast.error("Tạo thông báo thất bại!");
      console.error("Create notification error", err);
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
    console.log("Toggle:", id, seen);
    updateMutation.mutate({
      id,
      seen,
    });
  };

  const isLoading = isReadLoading || isTotalLoading || isUnreadLoading;
  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <Header setShowCreateModal={setShowCreateModal} />
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
        isUpdating={updateMutation.isPending}
        setSelectedIdToDelete={setSelectedIdToDelete}
        setShowDeleteModal={setShowDeleteModal}
      />

      {showDeleteModal && (
        <DeleteConfirmModal
          // isSuccess={deleteMutation.isSuccess}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (selectedIdToDelete !== null) {
              deleteMutation.mutate(selectedIdToDelete);
            }
          }}
          isPending={deleteMutation.isPending}
        />
      )}
      <CreateNotificationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(data) => {
          createMutation.mutate(data);
        }}
        isCreating={createMutation.isPending}
      />
    </div>
  );
}
