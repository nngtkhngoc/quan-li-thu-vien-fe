import { Bell, CheckCircle, MailWarning, MoreVertical } from "lucide-react";
import type { Notification } from "../../../../types/Notification";
import { useState } from "react";
import { format } from "date-fns";

export default function NotificationsList({
  filteredNotifications,
  filter,
  onToggleSeen,
  onDelete,
}: {
  filteredNotifications: Notification[];
  filter: string;
  onToggleSeen: (id: BigInteger, seen: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="space-y-3 py-5  ">
      {filteredNotifications.length > 0 ? (
        filteredNotifications.map((notification: Notification) => (
          <div
            key={notification.id.toString()}
            className={`rounded-xl py-5 px-4 transition-all duration-300 border shadow-sm hover:shadow-md ${
              notification.seen
                ? "border-gray-100"
                : "bg-red-50 border-green-100"
            }`}
          >
            <div className="flex items-start space-x-4 relative">
              <div className="flex-shrink-0 mt-1">
                {notification.seen ? (
                  <CheckCircle className="text-green-600" />
                ) : (
                  <MailWarning className="text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className={`text-md font-medium mt-1 ${
                        notification.seen
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-red-600 dark:text-gray-800"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {format(
                        new Date(notification.createdAt),
                        "MMM dd, yyyy • h:mm a"
                      )}
                    </p>
                  </div>

                  <div className="relative ">
                    <div className="flex-shrink-0 ml-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.seen ? "bg-transparent" : "bg-red-600"
                        }`}
                      ></div>
                    </div>
                    <button
                      onClick={() => toggleDropdown(Number(notification.id))}
                      className="p-1 text-gray-400 hover:text-black dark:hover:text-white rounded-full cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {openMenuId === Number(notification.id) && (
                      <div className="absolute right-0 z-10 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
                        <button
                          onClick={() => {
                            onToggleSeen(notification.id, notification.seen);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                        >
                          {notification.seen
                            ? "Đánh dấu chưa đọc"
                            : "Đánh dấu đã đọc"}
                        </button>
                        <button
                          onClick={() => {
                            onDelete(notification.id.toString());
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          Xóa thông báo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không có thông báo nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === "all"
              ? "You're all caught up! No notifications to show."
              : `No ${filter} notifications at the moment.`}
          </p>
        </div>
      )}
    </div>
  );
}
