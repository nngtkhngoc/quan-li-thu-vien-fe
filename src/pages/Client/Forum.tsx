import { useState, useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import { useMessage } from "../../hooks/useMessage";
import {
  MessageCircle,
  Send,
  Users,
  Clock,
  ChevronUp,
  Edit2,
  Trash2,
  Check,
  X,
  MoreVertical,
} from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { ConfirmModal } from "../../components/Admin/ConfirmModal";

export default function Forum() {
  const { userProfile } = useUser();
  const username = userProfile?.name;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use React Query for message management
  const {
    messages,
    isLoadingMessages,
    isErrorMessages,
    updateMessage,
    deleteMessage,
    isUpdatingMessage,
    updatingMessageId,
    deletingMessageId,
  } = useMessage();

  // Use WebSocket for real-time messaging
  const { sendMessage } = useChat(username || "");

  const [input, setInput] = useState("");
  const [messagesLimit, setMessagesLimit] = useState(10);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showMenuForMessage, setShowMenuForMessage] = useState<number | null>(
    null
  );
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    show: boolean;
    messageId: number | null;
  }>({ show: false, messageId: null });

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLoadMore = () => {
    setMessagesLimit(prev => prev + 10); // Tải thêm 10 tin nhắn
  };

  const handleEditMessage = (messageId: number, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditingContent(currentContent);
    setShowMenuForMessage(null);
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editingContent.trim()) {
      updateMessage(
        {
          id: editingMessageId,
          messageData: {
            content: editingContent.trim(),
          },
        },
        {
          onSuccess: () => {
            setEditingMessageId(null);
            setEditingContent("");
          },
        }
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleDeleteMessage = (messageId: number) => {
    setDeleteConfirmModal({ show: true, messageId });
    setShowMenuForMessage(null);
  };

  const confirmDeleteMessage = () => {
    if (deleteConfirmModal.messageId) {
      deleteMessage(deleteConfirmModal.messageId);
    }
    setDeleteConfirmModal({ show: false, messageId: null });
  };

  const cancelDeleteMessage = () => {
    setDeleteConfirmModal({ show: false, messageId: null });
  };

  const toggleMessageMenu = (messageId: number) => {
    setShowMenuForMessage(showMenuForMessage === messageId ? null : messageId);
  };

  const isOwnMessage = (senderName: string) => {
    return senderName === username;
  };

  // Lấy tin nhắn theo limit, từ tin nhắn mới nhất
  const displayedMessages = messages?.slice(-messagesLimit) || [];
  const hasMoreMessages = messages && messages.length > messagesLimit;

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages.length]);

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = () => {
  //     setShowMenuForMessage(null);
  //   };

  //   if (showMenuForMessage !== null) {
  //     document.addEventListener("click", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("click", handleClickOutside);
  //     };
  //   }
  // }, [showMenuForMessage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Diễn Đàn Thảo Luận
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Tham gia thảo luận với cộng đồng độc giả
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thành viên online
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(Math.random() * 20) + 5}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tin nhắn hiển thị
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayedMessages.length}/{messages?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hoạt động gần nhất
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(messages?.length || 0) > 0
                    ? new Date(
                        messages![messages!.length - 1]?.timestamp
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Cuộc trò chuyện chung
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đang tham gia với tư cách:{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {username}
                  </span>
                  {hasMoreMessages && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                      {(messages?.length || 0) - messagesLimit} tin nhắn bị ẩn
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            {/* Load More Button */}
            {hasMoreMessages && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Tải thêm tin nhắn cũ (
                  {(messages?.length || 0) - messagesLimit} tin nhắn)
                </button>
              </div>
            )}

            {isLoadingMessages ? (
              <div className="text-center py-12">
                <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Đang tải tin nhắn...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Vui lòng chờ trong giây lát
                </p>
              </div>
            ) : isErrorMessages ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-red-300 dark:text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Không thể tải tin nhắn
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Có lỗi xảy ra khi tải tin nhắn. Vui lòng thử lại sau.
                </p>
              </div>
            ) : displayedMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Chưa có tin nhắn nào
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên!
                </p>
              </div>
            ) : (
              displayedMessages?.map((msg, i) => (
                <div key={i} className="flex space-x-3 group">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {msg.senderName?.charAt(0).toUpperCase() || "X"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {msg.senderName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                        {editingMessageId === msg.id && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            (Đang chỉnh sửa)
                          </span>
                        )}
                      </div>

                      {/* Message Actions - Only show for own messages */}
                      {isOwnMessage(msg.senderName) && msg.id && (
                        <div className="relative">
                          <button
                            onClick={() => toggleMessageMenu(msg.id!)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {showMenuForMessage === msg.id && (
                            <div
                              onClick={e => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                            >
                              <button
                                onClick={() =>
                                  handleEditMessage(msg.id!, msg.content)
                                }
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit2 className="h-3 w-3 mr-2" />
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id!)}
                                disabled={deletingMessageId === msg.id}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                              >
                                {deletingMessageId === msg.id ? (
                                  <>
                                    <div className="animate-spin h-3 w-3 mr-2 border border-red-600 border-t-transparent rounded-full"></div>
                                    Đang xóa...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Xóa
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {editingMessageId === msg.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingContent}
                            onChange={e => setEditingContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                            rows={2}
                            placeholder="Chỉnh sửa tin nhắn..."
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={
                                !editingContent.trim() ||
                                (isUpdatingMessage &&
                                  updatingMessageId === msg.id)
                              }
                              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                              {isUpdatingMessage &&
                              updatingMessageId === msg.id ? (
                                <>
                                  <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full"></div>
                                  Đang lưu...
                                </>
                              ) : (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Lưu
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 text-sm font-medium"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900 dark:text-white">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Scroll anchor for auto-scroll to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="px-6 py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
              >
                <Send className="h-4 w-4" />
                <span>Gửi</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Nhấn Enter để gửi tin nhắn
            </p>
          </form>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {deleteConfirmModal.show && (
        <ConfirmModal
          onSave={confirmDeleteMessage}
          onCancel={cancelDeleteMessage}
          isPending={deletingMessageId === deleteConfirmModal.messageId}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Xóa tin nhắn
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể
              hoàn tác.
            </p>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
}
