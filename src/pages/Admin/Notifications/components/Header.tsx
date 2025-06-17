/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from "lucide-react";

export default function Header({
  setShowCreateModal,
}: {
  setShowCreateModal: any;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý thông báo </h1>
        <p className="text-gray-600 mt-1">
          Quản lý và gửi thông báo đến người dùng
        </p>
      </div>
      <div className="flex space-x-3 mt-4 sm:mt-0">
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex cursor-pointer items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Gửi thông báo
        </button>
      </div>
    </div>
  );
}
