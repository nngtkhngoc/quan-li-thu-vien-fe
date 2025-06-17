import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <Trash2 className="w-6 h-6" />
          <h3 className="text-lg font-bold">Xác nhận xoá thông báo</h3>
        </div>
        <p className="text-gray-700">
          Bạn có chắc chắn muốn xoá thông báo này? Hành động này không thể hoàn
          tác.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isPending}
            className={`px-4 py-2 rounded-md text-white hover:bg-red-600 ${
              isPending
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 cursor-pointer"
            }`}
          >
            {isPending ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </div>
    </div>
  );
}
