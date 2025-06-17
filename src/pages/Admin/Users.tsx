import { useState } from "react";
import { Search, Edit, Trash2, Eye, Users as UsersIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "antd";
import { deleteUser, getAllUsers, updateUser } from "../../api/user.api";
import type { UserResponse, UpdateUserRequest } from "../../types/User";

import { toast } from "react-toastify";

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
      mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
        updateUser(id, data),
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
    updateUserMutation({ id: isEditing.id, data });
  };

  const handleDelete = () => {
    if (!isDeleting) return;
    deleteUserMutation(isDeleting);
  };

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
        <UserFormModal
          user={isEditing}
          onSave={handleUpdate}
          onCancel={() => setIsEditing(null)}
          isPending={isPendingUpdate}
        />
      )}
      {isDeleting && (
        <ConfirmModal
          onSave={handleDelete}
          onCancel={() => setIsDeleting(null)}
          isPending={isPendingDelete}
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Bạn chắc chắn muốn xóa người dùng này?
          </h3>
        </ConfirmModal>
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

function UserFormModal({
  user,
  onSave,
  onCancel,
  isPending,
}: {
  user: UserResponse;
  onSave: (data: UpdateUserRequest) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "USER",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
          <div></div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:bg-gray-700"
            >
              {isPending ? "Đang lưu..." : user.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết người dùng
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Họ và tên
              </label>
              <p className="text-lg font-semibold text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Vai trò
              </label>
              <span
                className={`inline-flex text-sm font-semibold rounded-full`}
              >
                {user.role === "ADMIN"
                  ? "Quản trị viên"
                  : user.role === "LIBRARIAN"
                  ? "Thủ thư"
                  : "Người dùng"}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Ngày tham gia
              </label>
              <p className="text-gray-900">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hoạt động
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      Tổng số lần mượn
                    </p>
                    <p className="text-2xl font-bold text-indigo-700">
                      {user.lendings.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      Tổng số lần đặt trước
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {user.reservations.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  onSave,
  onCancel,
  isPending,
  children,
}: {
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          {children}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              disabled={isPending}
              onClick={onSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:bg-gray-700"
            >
              {isPending ? "Đang xóa..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
