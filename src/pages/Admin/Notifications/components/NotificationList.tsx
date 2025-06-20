/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, EyeOff, Trash2, Bell } from "lucide-react";
import type { Notification } from "../../../../types/Notification";
interface Props {
  notifications: Notification[];
  handleToggleRead: (id: BigInteger, seen: boolean) => void;
  setShowDeleteModal: any;
  isUpdating: boolean;
  setSelectedIdToDelete: any;
}

export default function NotificationList({
  notifications,
  handleToggleRead,
  setShowDeleteModal,
  isUpdating,
  setSelectedIdToDelete,
}: Props) {
  if (!notifications.length) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Không có thông báo nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id.toString()}
          className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
            !notification.seen ? "border-l-4 border-l-indigo-500" : ""
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-1">
              <p
                className={`font-semibold ${
                  notification.seen ? "text-gray-700" : "text-gray-900"
                }`}
              >
                {notification.message}
              </p>
              <div className="flex text-xs text-gray-500 gap-2">
                <span>User: {notification.user?.name || "Unknown"}</span>
                <span>
                  {new Date(notification.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() =>
                  handleToggleRead(notification.id, notification.seen)
                }
                title={
                  notification.seen ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"
                }
                disabled={isUpdating}
                className={`text-gray-400 hover:text-gray-600 cursor-pointer ${
                  isUpdating ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {notification.seen ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setSelectedIdToDelete(notification.id);
                }}
                title="Xoá thông báo"
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
