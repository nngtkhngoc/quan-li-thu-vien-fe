import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Eye, Users as UsersIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "antd";
import { deleteUser, getAllUsers, updateUser } from "../../api/user.api";
import type { UserResponse } from "../../types/User";
import { toast } from "react-toastify";
import { AdminConfirmModal } from "../../components/Admin/AdminConfirmModal";
import AdminDeleteModal from "../../components/Admin/AdminDeleteModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Users() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const invalidateQuery = () =>
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<UserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [viewingUser, setViewingUser] = useState<UserResponse | null>(null);

  const { mutate: updateUserMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
        updateUser(id, formData),
      onSuccess() {
        invalidateQuery();
        toast.success("Cập nhật người dùng thành công");
        setIsEditing(null);
      },
      onError() {
        toast.error("Cập nhật người dùng thất bại");
      },
    });

  const { mutate: deleteUserMutation, isPending: isPendingDelete } =
    useMutation({
      mutationFn: deleteUser,
      onSuccess() {
        invalidateQuery();
        toast.success("Xóa người dùng thành công");
        setIsDeleting(null);
      },
      onError() {
        toast.error("Xóa người dùng thất bại");
      },
    });

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm);

    return matchesSearch;
  });

  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleUpdate = (data: UpdateUserRequest) => {
    if (!isEditing) return;
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    if (data.role) formData.append("role", data.role);
    updateUserMutation({ id: isEditing.id, formData });
  };

  const handleDelete = () => {
    if (!isDeleting) return;
    deleteUserMutation(isDeleting);
  };

  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: "",
    email: "",
    role: "USER",
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: isEditing.name || "",
        email: isEditing.email || "",
        role: isEditing.role || "USER",
      });
    }
  }, [isEditing]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý thành viên thư viện và tài khoản của họ
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoạt động
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="ml-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-center">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thành viên thư viện và tài khoản của họ
          </p>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoạt động
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Thành viên từ{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex  text-sm font-semibold rounded-full 
                    }`}
                    >
                      {user.role === "ADMIN"
                        ? "Quản trị viên"
                        : user.role === "LIBRARIAN"
                        ? "Thủ thư"
                        : "Người dùng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Mượn sách: {user.lendings.length}</div>
                      <div>Đặt trước: {user.reservations.length}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setViewingUser(user)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Xem chi tiết"
                        disabled={isPendingUpdate || isPendingDelete}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsEditing(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                        disabled={isPendingUpdate || isPendingDelete}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setIsDeleting(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                        disabled={isPendingUpdate || isPendingDelete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredUsers?.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy người dùng</p>
            <p className="text-gray-400">Hãy thử điều chỉnh tìm kiếm của bạn</p>
          </div>
        )}
      </div>
      {/* Pagination */}
      {!isLoading && filteredUsers && filteredUsers.length > 0 && (
        <div className="mt-6">
          <Pagination
            total={filteredUsers.length}
            showSizeChanger={false}
            pageSize={pageSize}
            current={currentPage}
            onChange={setCurrentPage}
            className="flex justify-center"
          />
        </div>
      )}
      {/* Modals */}
      {isEditing && (
        <AdminConfirmModal
          isOpen={!!isEditing}
          onCancel={() => {
            setIsEditing(null);
            setFormData({ name: "", email: "", role: "USER" });
          }}
          onSave={() => handleUpdate(formData)}
          isPending={isPendingUpdate}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Chỉnh sửa người dùng
            </h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </form>
          </div>
        </AdminConfirmModal>
      )}
      {isDeleting && (
        <AdminDeleteModal
          isOpen={!!isDeleting}
          onClose={() => setIsDeleting(null)}
          onConfirm={handleDelete}
          isPending={isPendingDelete}
        />
      )}
      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}
    </div>
  );
}

function UserDetailsModal({
  user,
  onClose,
}: {
  user: UserResponse;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 border-b border-gray-200"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Chi tiết người dùng
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 space-y-6"
          >
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center"
                  >
                    <UsersIcon className="h-8 w-8 text-indigo-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Vai trò
                    </label>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "LIBRARIAN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
                    </motion.span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Ngày tham gia
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Activity Stats */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hoạt động
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-indigo-200 rounded-lg"
                    >
                      <svg
                        className="h-6 w-6 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </motion.div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-indigo-600">
                        Tổng số lần mượn
                      </p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                        className="text-2xl font-bold text-indigo-700"
                      >
                        {user.lendings.length}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-emerald-200 rounded-lg"
                    >
                      <svg
                        className="h-6 w-6 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </motion.div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-emerald-600">
                        Tổng số lần đặt trước
                      </p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.6 }}
                        className="text-2xl font-bold text-emerald-700"
                      >
                        {user.reservations.length}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                {user.lendings.slice(0, 3).map((lending, index) => (
                  <motion.div
                    key={lending.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 bg-indigo-100 rounded-lg"
                    >
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Mượn sách: {lending.book_item.book?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(lending.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {user.lendings.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-500 text-center py-4"
                  >
                    Chưa có hoạt động mượn sách
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="px-6 py-4 border-t border-gray-200"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Đóng
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
