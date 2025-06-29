import { useState } from "react";
import {
  Search,
  AlertTriangle,
  Filter,
  ArrowRightLeft,
  CheckCircle,
  Trash2,
  Hourglass,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBorrowedBook, updateBorrowedBook } from "../../api/borrow.api";
import useBorrow from "../../hooks/useBorrow";
import { toast } from "react-toastify";
import AdminDeleteModal from "../../components/Admin/AdminDeleteModal";
import { AdminConfirmModal } from "../../components/Admin/AdminConfirmModal";

// Loading Skeleton Component

type ChangeStatus = {
  id: number;
  status: string;
};

const statuses = ["ALL", "BORROWED", "RETURNED", "OVERDUE"];
const vnStatus = new Map();
vnStatus.set("ALL", "Tất cả");
vnStatus.set("BORROWED", "Đã cho mượn");
vnStatus.set("RETURNED", "Đã trả");
vnStatus.set("OVERDUE", "Quá hạn");

export default function Borrows() {
  const { borrows, isLoadingBorrows } = useBorrow();

  const queryClient = useQueryClient();
  const invalidateQuery = () =>
    queryClient.invalidateQueries({
      queryKey: ["borrowed-books"],
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [isChangingStatus, setIsChangingStatus] = useState(
    {} as unknown as ChangeStatus
  );
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  // const [showAddModal, setShowAddModal] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => {
      const updateData: { status: string; return_date: string | null } = {
        status,
        return_date: status === "RETURNED" ? new Date().toISOString() : null,
      };
      return updateBorrowedBook(id, updateData);
    },
    onSuccess() {
      invalidateQuery();
      setIsChangingStatus({} as unknown as ChangeStatus);
      toast.success("Thay đổi thành công");
    },
  });

  const { mutate: deleteBorrow, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteBorrowedBook,
    onSuccess() {
      invalidateQuery();
      setIsDeleting(null);
      toast.success("Xóa thành công");
    },
  });

  const filteredBorrows = borrows?.filter(borrow => {
    const matchesSearch =
      borrow.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrow.book_item.book.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || borrow.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    BORROWED: "bg-blue-100 text-blue-800",
    RETURNED: "bg-emerald-100 text-emerald-800",
    OVERDUE: "bg-red-100 text-red-800",
  };

  const handleStatusChange = ({ id, status = "RETURNED" }: ChangeStatus) => {
    if (!id) return;
    mutate({ id, status });
  };

  const handleDelete = () => {
    if (!isDeleting) return;
    deleteBorrow(isDeleting);
  };

  if (isLoadingBorrows) {
    return <BorrowsSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý mượn sách
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý các giao dịch mượn sách
          </p>
        </div>
        {/* <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Borrow
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đang cho mượn</p>
              <p className="text-xl font-semibold text-gray-900">
                {borrows?.filter(b => b.status === "BORROWED").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Quá hạn</p>
              <p className="text-xl font-semibold text-gray-900">
                {borrows?.filter(b => b.status === "OVERDUE").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đã trả</p>
              <p className="text-xl font-semibold text-gray-900">
                {borrows?.filter(b => b.status === "RETURNED").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng hoặc tên sách..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {vnStatus.get(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Borrows Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng & Sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tháng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(filteredBorrows?.length ?? 0) === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500 italic"
                  >
                    Không có lượt mượn nào.
                  </td>
                </tr>
              ) : (
                (filteredBorrows ?? []).map(borrow => (
                  <tr key={borrow.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {borrow.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {borrow.book_item.book.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>
                          Ngày mượn:{" "}
                          {new Date(borrow.borrow_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div
                          className={
                            borrow.status === "OVERDUE" ? "text-red-600" : ""
                          }
                        >
                          Hạn trả:{" "}
                          {new Date(borrow.due_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        {borrow.return_date && borrow.status === "RETURNED" && (
                          <div className="text-emerald-600">
                            Ngày trả:{" "}
                            {new Date(borrow.return_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[borrow.status]
                        }`}
                      >
                        {vnStatus.get(borrow.status) || borrow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {borrow.status !== "PENDING" && (
                          <button
                            onClick={() =>
                              setIsChangingStatus({
                                id: borrow.id,
                                status: "PENDING",
                              })
                            }
                            className="text-gray-600 hover:text-gray-900"
                            title="Đánh dấu là đang chờ"
                          >
                            <Hourglass className="h-4 w-4" />
                          </button>
                        )}
                        {borrow.status !== "RETURNED" && (
                          <button
                            onClick={() =>
                              setIsChangingStatus({
                                id: borrow.id,
                                status: "RETURNED",
                              })
                            }
                            className="text-emerald-600 hover:text-emerald-900"
                            title="Đánh dấu là đã trả"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {borrow.status !== "BORROWED" && (
                          <button
                            onClick={() =>
                              setIsChangingStatus({
                                id: borrow.id,
                                status: "BORROWED",
                              })
                            }
                            className="text-blue-600 hover:text-blue-900"
                            title="Đánh dấu là đã mượn"
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Xóa lần mượn này"
                          onClick={() => setIsDeleting(borrow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredBorrows?.length === 0 && (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Không tìm thấy bản ghi mượn sách
            </p>
            <p className="text-gray-400">
              Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Add Borrow Modal */}

      <AdminConfirmModal
        onSave={() => handleStatusChange(isChangingStatus)}
        onCancel={() => setIsChangingStatus({} as unknown as ChangeStatus)}
        isPending={isPending}
        isOpen={isChangingStatus.id != null}
      >
        <h3 className="text-xl font-semibold text-gray-800">
          Bạn chắc chắn muốn cập nhật trạng thái sang{" "}
          {isChangingStatus.status === "BORROWED" && "Đang mượn"}
          {isChangingStatus.status === "PENDING" && "Đang chờ"}
          {isChangingStatus.status === "RETURNED" && "Đã trả"}?
        </h3>
      </AdminConfirmModal>

      <AdminDeleteModal
        isOpen={isDeleting != null}
        onConfirm={handleDelete}
        onClose={() => setIsDeleting(null)}
        isPending={isPendingDelete}
      ></AdminDeleteModal>
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
              {isPending ? "Đang cập nhật..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const BorrowsSkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-80"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(index => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gray-200 rounded-lg">
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
              </div>
              <div className="ml-3">
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-6 bg-gray-300 rounded w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>

          {/* Table Rows */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map(index => (
            <div key={index} className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4 items-center">
                {/* User & Book Column */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </div>

                {/* Dates Column */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>

                {/* Status Column */}
                <div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
