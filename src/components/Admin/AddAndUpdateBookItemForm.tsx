export default function AddAndUpdateBookItemModal({
  setModal,
  bookItems,
}: any) {
  return (
    <div className="w-[100vw] h-[100vh] bg-gray-500/70">
      <div className="bg-white p-6 rounded shadow-lg max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-4">
          {bookItems ? "Cập nhật bản sao sách" : "Thêm bản sao sách"}
        </h2>
        <form className="space-y-4" id="book-item-form">
          <select
            defaultValue={bookItems ? bookItems.status : "AVAILABLE"}
            className="w-full p-2 border rounded"
          >
            <option value="AVAILABLE">Có sẵn</option>
            <option value="BORROWED">Đã mượn</option>
          </select>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {bookItems ? "Cập nhật" : "Thêm"}
          </button>
          <button
            className=""
            onClick={() => {
              const form = document.querySelector(
                "#book-item-form"
              ) as HTMLFormElement;
              form.reset();
              setModal();
            }}
          >
            Hủy bỏ
          </button>
        </form>
      </div>
    </div>
  );
}
