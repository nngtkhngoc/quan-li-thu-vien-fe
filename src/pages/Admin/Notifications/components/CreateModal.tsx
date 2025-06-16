import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { userId: number; message: string }) => void;
  isCreating: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function CreateNotificationModal({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all users on open
  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:5002/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Failed to fetch users:", err));
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const selectedUser = users.find((user) => user.email === selectedEmail);
    if (!selectedUser || !message.trim()) return;
    onCreate({ userId: selectedUser.id, message });
    setSelectedEmail("");
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-lg space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Tạo thông báo mới</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gửi tới (email):
          </label>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mt-1"
          >
            <option value="">-- Chọn người nhận --</option>
            {users.map((user) => (
              <option key={user.id} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nội dung thông báo:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-md mt-1"
            placeholder="Nhập nội dung thông báo..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white cursor-pointer rounded hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!selectedEmail || !message.trim() || isCreating}
          >
            {isCreating ? "Đang gửi..." : "Tạo thông báo"}
          </button>
        </div>
      </div>
    </div>
  );
}
