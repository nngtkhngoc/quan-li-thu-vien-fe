import { useState } from "react";
import {
  Search,
  AlertTriangle,
  Filter,
  ArrowRightLeft,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteBorrowedBook,
  getAllBorrowedBooks,
  updateBorrowedBook,
} from "../../api/borrow.api";

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
  const { data: borrows } = useQuery({
    queryKey: ["borrowed-books"],
    queryFn: getAllBorrowedBooks,
  });

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
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateBorrowedBook(id, { status }),
    onSuccess() {
      invalidateQuery();
      setIsChangingStatus({} as unknown as ChangeStatus);
    },
  });

  const { mutate: deleteBorrow, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteBorrowedBook,
    onSuccess() {
      invalidateQuery();
      setIsDeleting(null);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Borrow Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage book borrowing transactions
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
              placeholder="Search by user name or book title..."
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
                  User & Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrows?.map(borrow => (
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
                        Borrowed:{" "}
                        {new Date(borrow.borrow_date).toLocaleDateString()}
                      </div>
                      <div
                        className={
                          borrow.status === "OVERDUE" ? "text-red-600" : ""
                        }
                      >
                        Due: {new Date(borrow.return_date).toLocaleDateString()}
                      </div>
                      {borrow.return_date && (
                        <div className="text-emerald-600">
                          Returned:{" "}
                          {new Date(borrow.return_date).toLocaleDateString()}
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
                      {borrow.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {borrow.status === "BORROWED" && (
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
                      {borrow.status === "RETURNED" && (
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredBorrows?.length === 0 && (
          <div className="text-center py-12">
            <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No borrow records found</p>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Add Borrow Modal */}
      {isChangingStatus.id && (
        <ConfirmModal
          onSave={() => handleStatusChange(isChangingStatus)}
          onCancel={() => setIsChangingStatus({} as unknown as ChangeStatus)}
          isPending={isPending}
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Bạn chắc chắn muốn cập nhật trạng thái sang{" "}
            {isChangingStatus.status === "BORROWED" ? "Đã mượn" : "Đã trả"}?
          </h3>
        </ConfirmModal>
      )}

      {isDeleting && (
        <ConfirmModal
          onSave={handleDelete}
          onCancel={() => setIsDeleting(null)}
          isPending={isPendingDelete}
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Bạn chắc chắn muốn xóa lần mượn sách này?
          </h3>
        </ConfirmModal>
      )}
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
