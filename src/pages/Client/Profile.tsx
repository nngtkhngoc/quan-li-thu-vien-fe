import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/user.api";
import type { UpdateUserRequest } from "../../types/User";
import { toast } from "react-toastify";
import {
  User,
  Calendar,
  BookOpen,
  Clock,
  Bookmark,
  History,
  Star,
  Trophy,
  AlertCircle,
} from "lucide-react";

interface Lending {
  id: number;
  book_item: {
    book: {
      title: string;
      cover_image?: string;
    };
  };
  borrowed_at: Date;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
}

export default function Profile() {
  const { userProfile: user } = useUser();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "USER",
  });

  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Cập nhật thông tin thành công");
      setIsEditing(false);
    },
    onError() {
      toast.error("Cập nhật thông tin thất bại");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUserMutation({ id: user.id, data: formData });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-lg mt-6">
              Vui lòng đăng nhập để xem thông tin
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate user stats
  const totalBorrows = user.lendings.length;
  const activeBorrows = user.lendings.filter(
    (l) => l.status === "BORROWED"
  ).length;
  const returnedBorrows = user.lendings.filter(
    (l) => l.status === "RETURNED"
  ).length;
  const overdueBorrows = user.lendings.filter(
    (l) => l.status === "OVERDUE"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0 relative group">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 animate-gradient-x">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-400 mb-6">{user.email}</p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span>
                      Tham gia từ{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-xl">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    <span>{totalBorrows} lần mượn sách</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-xl">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span>Độc giả tích cực</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Edit Form or Stats */}
          <div className="lg:col-span-1 space-y-8">
            {isEditing ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Chỉnh sửa thông tin
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                      {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Thống kê đọc sách
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-blue-500/30 rounded-full">
                          <BookOpen className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-base text-gray-300">Đang mượn</p>
                          <p className="text-3xl font-bold text-white">
                            {activeBorrows}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-purple-500/30 rounded-full">
                          <History className="h-6 w-6 text-purple-300" />
                        </div>
                        <div>
                          <p className="text-base text-gray-300">Đã trả</p>
                          <p className="text-3xl font-bold text-white">
                            {returnedBorrows}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-pink-900 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-red-800/40 rounded-full">
                          <AlertCircle className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                          <p className="text-base text-gray-300">Quá hạn</p>
                          <p className="text-3xl font-bold text-white">
                            {overdueBorrows}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0 p-3 bg-blue-800/40 rounded-full">
                          <Star className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-base text-gray-300">Tổng số</p>
                          <p className="text-3xl font-bold text-white">
                            {totalBorrows}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Sách đã đặt trước
                  </h2>
                  <div className="space-y-4">
                    {user.reservations.length > 0 ? (
                      user.reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl transform transition-all duration-300 hover:scale-105"
                        >
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Bookmark className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {reservation.book_item.book.title}
                            </p>
                            <p className="text-sm text-gray-400">
                              Đặt trước:{" "}
                              {new Date(
                                reservation.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/50 mb-4">
                          <Bookmark className="h-8 w-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400">
                          Chưa có sách nào được đặt trước
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-6">
                Hoạt động gần đây
              </h2>
              <div className="space-y-4">
                {(user.lendings as Lending[]).slice(0, 5).map((lending) => (
                  <div
                    key={lending.id}
                    className="flex items-center gap-6 p-4 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex-shrink-0 w-20 h-28 bg-gray-600 rounded-lg overflow-hidden shadow-lg">
                      {lending.book_item.book.cover_image ? (
                        <img
                          src={lending.book_item.book.cover_image}
                          alt={lending.book_item.book.title}
                          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                          <BookOpen className="h-10 w-10 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white truncate">
                        {lending.book_item.book.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(lending.borrowed_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            lending.status === "BORROWED"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : lending.status === "RETURNED"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {lending.status === "BORROWED"
                            ? "Đang mượn"
                            : lending.status === "RETURNED"
                            ? "Đã trả"
                            : "Quá hạn"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {user.lendings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-700/50 to-gray-600/50 mb-4">
                      <BookOpen className="h-10 w-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400">
                      Chưa có hoạt động mượn sách nào
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
