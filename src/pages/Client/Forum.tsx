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
  Search,
  XCircle,
} from "lucide-react";
import { useUser } from "../../hooks/useUser";
import ConfirmModal from "../../components/Client/ClientDeleteModal";
import { useMutation } from "@tanstack/react-query";
import { createNotification } from "../../api/notification.api";

export default function Forum() {
  const { userProfile } = useUser();
  const { id, name: username } = userProfile ?? { id: 0, username: "" };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use React Query for message management
  const {
    messages,
    isLoadingMessages,
    isErrorMessages,
    updateMessage,
    deleteMessage,
    isUpdatingMessage,
    isDeletingMessage,
    updatingMessageId,
    deletingMessageId,
    numActiveUsers,
  } = useMessage();

  const { mutate: sendNotification } = useMutation({
    mutationFn: createNotification,
  });

  // Use WebSocket for real-time messaging
  const { sendMessage } = useChat(id || 0);

  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  const searchInputRef = useRef<HTMLInputElement>(null);

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
      deleteMessage(deleteConfirmModal.messageId, {
        onSuccess() {
          setDeleteConfirmModal({ show: false, messageId: null });
        },
      });
    }
  };

  const cancelDeleteMessage = () => {
    setDeleteConfirmModal({ show: false, messageId: null });
  };

  const toggleMessageMenu = (messageId: number) => {
    setShowMenuForMessage(showMenuForMessage === messageId ? null : messageId);
  };

  const isOwnMessage = (senderId: number) => {
    return senderId === id;
  };

  const isAdmin = userProfile?.role === "ADMIN";

  // Function to highlight search terms in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-600 dark:text-black rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Filter messages based on search query
  const filteredMessages = messages?.filter(msg => {
    if (!searchQuery.trim()) return true;
    return (
      msg.content.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      msg.senderName?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  });

  const displayedMessages = searchQuery.trim()
    ? filteredMessages || []
    : messages?.slice(-messagesLimit) || [];

  const hasMoreMessages =
    !searchQuery.trim() && messages && messages.length > messagesLimit;

  useEffect(() => {
    if (displayedMessages.length > 10) return;
    const { scrollX, scrollY } = window;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    window.scroll(scrollX, scrollY);
    console.log(messagesEndRef.current);
  }, [displayedMessages.length]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Diễn đàn thảo luận
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
                  {numActiveUsers}
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
                  {searchQuery.trim()
                    ? "Kết quả tìm kiếm"
                    : "Tin nhắn hiển thị"}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchQuery.trim()
                    ? `${displayedMessages.length}/${messages?.length || 0}`
                    : `${displayedMessages.length}/${messages?.length || 0}`}
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
                  {!id ? (
                    <span className="text-yellow-600 dark:text-yellow-400">
                      Vui lòng đăng nhập để tham gia trò chuyện
                    </span>
                  ) : (
                    <>
                      Đang tham gia với tư cách:{" "}
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {username}
                      </span>
                      {hasMoreMessages && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                          {(messages?.length || 0) - messagesLimit} tin nhắn bị
                          ẩn
                        </span>
                      )}
                    </>
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

          {/* Search Bar */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Tìm kiếm tin nhắn theo nội dung hoặc tên người gửi... (Ctrl+F)"
              />
              {searchQuery && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {displayedMessages.length > 0
                  ? `Tìm thấy ${displayedMessages.length} tin nhắn khớp với "${searchQuery}"`
                  : `Không tìm thấy tin nhắn nào khớp với "${searchQuery}"`}
              </div>
            )}
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            {/* Load More Button - Only show when not searching */}
            {hasMoreMessages && !searchQuery.trim() && (
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
                {searchQuery.trim() ? (
                  <>
                    <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Không tìm thấy tin nhắn
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Không có tin nhắn nào khớp với từ khóa "{searchQuery}".
                      Thử tìm kiếm với từ khóa khác.
                    </p>
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Chưa có tin nhắn nào
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu
                      tiên!
                    </p>
                  </>
                )}
              </div>
            ) : (
              displayedMessages?.map(msg => {
                const isOwn = isOwnMessage(msg.senderId);
                return (
                  <div
                    key={msg.id}
                    className={`flex group ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar and content for others' messages (left side) */}
                    {!isOwn && (
                      <div className="flex space-x-3 max-w-[80%]">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {msg.image && <img src={msg.image} alt="" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {msg.senderName}{" "}
                                {msg.edited && "(đã chỉnh sửa)"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }
                                )}
                              </p>
                            </div>

                            {/* Admin Actions - Only show for admin on others' messages */}
                            {isAdmin && msg.id && (
                              <div className="relative">
                                <button
                                  onClick={() => toggleMessageMenu(msg.id!)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>

                                {/* Admin Dropdown Menu */}
                                {showMenuForMessage === msg.id && (
                                  <div
                                    onClick={e => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px]"
                                  >
                                    <button
                                      onClick={() => {
                                        handleDeleteMessage(msg.id!);
                                        sendNotification({
                                          user_id: msg.senderId,
                                          message: `Tin nhắn "${msg.content}" của bạn đã bị xóa bởi Admin`,
                                        });
                                      }}
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
                                          Xóa tin nhắn với quyền Admin
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Message Content for others */}
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {highlightSearchTerm(msg.content, searchQuery)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content and avatar for own messages (right side) */}
                    {isOwn && (
                      <div className="flex space-x-3 max-w-[80%]">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-end space-x-2 mb-1">
                            {editingMessageId === msg.id && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                (Đang chỉnh sửa)
                              </span>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(msg.timestamp).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )}
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Bạn {msg.edited && "(đã chỉnh sửa)"}
                            </p>

                            {/* Message Actions - Only show for own messages */}
                            {msg.id && (
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
                                      onClick={() =>
                                        handleDeleteMessage(msg.id!)
                                      }
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

                          {/* Message Content for own messages */}
                          <div className="p-3  bg-gradient-to-br from-blue-600 to-purple-600  text-white rounded-lg shadow-sm">
                            {editingMessageId === msg.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingContent}
                                  onChange={e =>
                                    setEditingContent(e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-transparent bg-white text-gray-900 text-sm resize-none"
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
                                    className="inline-flex items-center px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                  >
                                    {isUpdatingMessage &&
                                    updatingMessageId === msg.id ? (
                                      <>
                                        <div className="animate-spin h-3 w-3 mr-1 border border-blue-600 border-t-transparent rounded-full"></div>
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
                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Hủy
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-white">
                                {highlightSearchTerm(msg.content, searchQuery)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {msg.image && <img src={msg.image} alt="" />}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Scroll anchor for auto-scroll to bottom */}
            <div className="endRef" ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!id ? (
            /* Login Required Message */
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center justify-center space-x-3 py-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Bạn cần đăng nhập để tham gia trò chuyện
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                    Vui lòng đăng nhập để gửi tin nhắn và tham gia thảo luận với
                    cộng đồng
                  </p>
                </div>
                <button
                  onClick={() =>
                    (window.location.href = `/auth?redirect=/forum`)
                  }
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          ) : (
            /* Normal Input Form */
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
                  className="px-6 cursor-pointer py-3 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                >
                  <Send className="h-4 w-4" />
                  <span>Gửi</span>
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Nhấn Enter để gửi tin nhắn
              </p>
            </form>
          )}
        </div>
      </div>

      {
        <ConfirmModal
          onConfirm={confirmDeleteMessage}
          onClose={cancelDeleteMessage}
          isPending={isDeletingMessage}
          isOpen={deleteConfirmModal.show}
        ></ConfirmModal>
      }
    </div>
  );
}
