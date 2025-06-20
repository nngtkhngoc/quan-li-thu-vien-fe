/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/user.api";
import ProfileSkeleton from "../../components/Client/ProfileSkeleton";

import { toast } from "react-toastify";
import {
  User,
  Calendar,
  BookOpen,
  Clock,
  Bookmark,
  History,
  Star,
  AlertCircle,
  Camera,
  X,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserBadges } from "../../api/badge.api";

interface Lending {
  id: number;
  book_item: {
    book: {
      title: string;
      image?: string;
    };
  };
  borrow_date: Date;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
}

export default function Profile() {
  const { userProfile: user, setUserChanged, isLoading } = useUser();
  const queryClient = useQueryClient();

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  type BadgeResponse = Awaited<ReturnType<typeof getUserBadges>>;

  const { data: totalBadges, isLoading: isBadgesLoading } =
    useQuery<BadgeResponse>({
      queryKey: ["getAllBadges", user?.id],
      queryFn: async () => {
        if (!user) {
          return { success: false, message: "No user", data: [] };
        }
        return await getUserBadges(user.id);
      },
      enabled: !!user,
    });

  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateUser(id, formData),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setUserChanged(true);
      toast.success("Cập nhật thông tin thành công");
      setShowImageModal(false);
      setSelectedImage(null);
      setImagePreview(null);
    },
    onError() {
      toast.error("Cập nhật thông tin thất bại");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setSelectedImage(file);
      const Url = URL.createObjectURL(file);
      setImagePreview(Url);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !user) {
      console.log("No file selected or user not found");
      return;
    }

    console.log("Uploading file:", selectedImage);
    const formData = new FormData();
    formData.append("image", selectedImage);

    // Log FormData contents
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      updateUserMutation({
        id: user.id,
        formData,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Cập nhật ảnh thất bại");
    }
  };

  if (isLoading || isBadgesLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
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
  const categoryColors = {
    BOOK: "bg-blue-100 text-blue-800",
    COMMUNITY: "bg-emerald-100 text-emerald-800",
    ACHIEVEMENT: "bg-purple-100 text-purple-800",
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0 relative group">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 animate-gradient-x">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Camera className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-800/50 px-4 py-2 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <span>
                      Tham gia từ{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-800/50 px-4 py-2 rounded-xl">
                    <BookOpen className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <span>{totalBorrows} lần mượn sách</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Modal */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <motion.h3
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    Cập nhật ảnh đại diện
                  </motion.h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowImageModal(false);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                      {imagePreview ? (
                        <motion.img
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="w-full h-full flex flex-col items-center justify-center gap-2"
                        >
                          <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Chưa có ảnh
                          </p>
                        </motion.div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center"
                  >
                    <label className="cursor-pointer group">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] rounded-lg">
                        <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 flex items-center gap-2 group-hover:bg-transparent transition-colors">
                          <Upload className="h-5 w-5 text-blue-500 group-hover:text-white transition-colors" />
                          <span className="text-blue-500 group-hover:text-white transition-colors">
                            Chọn ảnh
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end gap-3 mt-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowImageModal(false);
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleImageUpload}
                      disabled={!selectedImage || isPending}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                        />
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Edit Form or Stats */}

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Huy hiệu đạt được
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {totalBadges?.data.map((badge: any) => (
                  <div
                    title={badge.description}
                    className="relative rounded-full  bg-gray-50 dark:bg-gray-800 p-4 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="">
                      <div className="text-center mb-4 h-[100px]">
                        <div className="text-4xl mb-2">{badge.iconUrl}</div>
                        <h3 className="font-semibold dark:text-gray-300 text-gray-900 mb-1">
                          {badge.badgeName}
                        </h3>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            categoryColors[
                              badge.category as keyof typeof categoryColors
                            ]
                          }`}
                        >
                          {badge.category === "BOOK" && "Đọc sách"}
                          {badge.category === "COMMUNITY" && "Cộng đồng"}
                          {badge.category === "ACHIEVEMENT" && "Thành tựu"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Thống kê đọc sách
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-500/20 dark:bg-blue-500/30 rounded-full">
                      <BookOpen className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        Đang mượn
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {activeBorrows}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-purple-500/20 dark:bg-purple-500/30 rounded-full">
                      <History className="h-6 w-6 text-purple-500 dark:text-purple-300" />
                    </div>
                    <div>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        Đã trả
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {returnedBorrows}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-red-500/20 dark:bg-red-800/40 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        Quá hạn
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {overdueBorrows}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-500/20 dark:bg-blue-800/40 rounded-full">
                      <Star className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-base text-gray-700 dark:text-gray-300">
                        Tổng số
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalBorrows}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Sách đã đặt trước
              </h2>
              <div className="space-y-4">
                {user.reservations.length > 0 ? (
                  user.reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 rounded-xl transform transition-all duration-300 hover:scale-105"
                    >
                      <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                        <Bookmark className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {reservation.bookItem.book.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Đặt trước:{" "}
                          {new Date(
                            reservation.reservationDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
                      <Bookmark className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Chưa có sách nào được đặt trước
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Hoạt động gần đây
              </h2>
              <div className="space-y-4">
                {(user.lendings as Lending[]).slice(0, 5).map((lending) => (
                  <div
                    key={lending.id}
                    className="flex items-center gap-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-600/30 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex-shrink-0 w-20 h-28 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden shadow-lg">
                      {lending.book_item.book.image ? (
                        <img
                          src={lending.book_item.book.image}
                          alt={lending.book_item.book.title}
                          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                          <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {lending.book_item.book.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(lending.borrow_date).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            lending.status === "BORROWED"
                              ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                              : lending.status === "RETURNED"
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
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
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-600/50 mb-4">
                      <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
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
