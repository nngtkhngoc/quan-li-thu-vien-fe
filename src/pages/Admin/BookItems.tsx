import { X } from "lucide-react";
import { useState } from "react";
import { useBookItem } from "../../hooks/useBookItem";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/Admin/ConfirmModal";
export default function BookItems({ setModal, bookItems, query }: any) {
  // const [modalAddAndUpdate, setModalAddAndUpdate] = useState(false);
  // const [editingBookItem, setEditingBookItem] = useState(null);
  const [modalDelete, setModalDelete] = useState<number | null>(null);

  bookItems = bookItems.sort((a: any, b: any) => {
    return a.id - b.id;
  });
  const {
    updateBookItemMutation,
    createBookItemMutation,
    deleteBookItemMutation,
  } = useBookItem(query);

  const handleDelete = async () => {
    try {
      await deleteBookItemMutation.mutateAsync(modalDelete as number);
      toast.success("Xóa bản sao sách thành công");
    } catch (error) {
      toast.error("Xóa bản sao sách thất bại");
    }
    setModalDelete(null);
  };
  return (
    <div className="bg-gray-500/50 fixed w-[100vw] h-[100vh] top-0 left-0 z-50">
      {modalDelete && (
        <ConfirmModal
          isOpen={!!modalDelete}
          // setIsOpen={setModalDelete}
          isPending={false}
          onSave={handleDelete}
          onCancel={() => {
            setModalDelete(null);
          }}
        >
          <div className="text-lg font-semibold">
            Bạn có chắc chắn muốn xóa bản sao sách này không?
          </div>
        </ConfirmModal>
      )}
      <div className="bg-white p-6 rounded shadow-lg max-w-3xl mx-auto mt-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Các bản sao của sách</h1>
          <X onClick={setModal} className="w-[50px] h-[30px]" />
        </div>

        <button
          onClick={async () => {
            try {
              await createBookItemMutation.mutateAsync({
                book_id: query,
              });
              toast.success("Thêm bản sao sách thành công");
            } catch (error) {
              toast.error("Thêm bản sao sách thất bại");
            }
          }}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm bản sao sách
        </button>

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Tên sách</th>
              <th className="px-4 py-2 border-b">Tác giả</th>
              <th className="px-4 py-2 border-b">Trạng thái</th>
              <th className="px-4 py-2 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookItems.map((item: any) => (
              <tr key={item.id}>
                <td className="px-4 py-2 border-b">{item.id}</td>
                <td className="px-4 py-2 border-b">{item.book.title}</td>
                <td className="px-4 py-2 border-b">{item.book.author}</td>
                <td className="px-4 py-2 border-b">
                  <select
                    defaultValue={item.status}
                    className="w-full p-2 border rounded"
                    onChange={async (e) => {
                      const updatedStatus = e.target.value;
                      console.log(updatedStatus);

                      try {
                        await updateBookItemMutation.mutateAsync({
                          id: item.id,
                          data: {
                            status: updatedStatus,
                          },
                        });
                        toast.success("Cập nhật trạng thái thành công");
                      } catch (error) {
                        toast.error("Cập nhật trạng thái thất bại");
                      }
                    }}
                  >
                    <option value="AVAILABLE">Có sẵn</option>
                    <option value="Borrowed">Đã mượn</option>
                  </select>
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => {
                      setModalDelete(item.id);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
