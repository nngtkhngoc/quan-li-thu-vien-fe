/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  BookOpen,
} from "lucide-react";
import { mockBooks } from "../../../data/mockData";
import { useBook } from "../../../hooks/useBook";
import type { BookResponse } from "../../../types/Book";
import { toast } from "react-toastify";
import { ConfigProvider, Pagination } from "antd";
import BookItems from "../BookItems";
import { useBookItem } from "../../../hooks/useBookItem";
import BookSkeleton from "./BookSkeleton";
const size = 8;
export default function Books() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<BookResponse | null>(null);
  const [page, setPage] = useState(0);
  const [, setCurrentParams] = useSearchParams();
  const [viewingBook, setViewingBook] = useState<BookResponse | null>(null);
  const [showBookItemsModal, setShowBookItemsModal] = useState(false);
  const { getBookItemsByBookIdQuery } = useBookItem(
    viewingBook ? viewingBook.id || 0 : 0
  );

  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("size", size.toString());

  const {
    getBookQuery,
    updateBookMutation,
    createBookMutation,
    deleteBookMutation,
    getCatalogsQuery,
  } = useBook(params.toString());
  console.log(
    getBookItemsByBookIdQuery?.isLoading,
    viewingBook ? viewingBook.id || 0 : 0,
    "book items loading"
  );
  if (
    getBookQuery.isLoading ||
    getCatalogsQuery?.isLoading ||
    getBookItemsByBookIdQuery?.isLoading
  ) {
    return <BookSkeleton />;
  }

  const categories = getCatalogsQuery.data;
  let books = getBookQuery.data.content || mockBooks;
  books = books.sort((a: any, b: any) => {
    return a.id - b.id;
  });
  const filteredBooks = books.filter((book: any) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesCategory =
    // filterCategory === "All" || book.category === filterCategory;
    const matchesCategory = true;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBookMutation.mutateAsync(id);
        toast.success("Xóa sách thành công!");
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("Xóa sách thất bại!");
      }
    }
  };

  const BookForm = ({
    book,
    onCancel,
  }: {
    book?: any;
    onSave: (book: Omit<BookResponse, "id">) => void;
    onCancel: () => void;
  }) => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const formElement = document.querySelector("#form") as HTMLFormElement;
      const formData = new FormData(formElement as HTMLFormElement);
      try {
        if (editingBook) {
          await updateBookMutation.mutateAsync({
            id: editingBook.id,
            formData,
          });
          toast.success("Cập nhật sách thành công!");
        } else {
          console.log("THEM DANH SACH");
          await createBookMutation.mutateAsync(formData);
          toast.success("Thêm sách thành công!");
        }
        setShowAddModal(false);
        setEditingBook(null);
        formElement.reset();
      } catch (error) {
        if (editingBook) {
          toast.error("Cập nhật sách thất bại!");
        } else {
          toast.error("Thêm sách thất bại!");
        }
      }
    };
    return (
      <div className="fixed inset-0 bg-gray-500/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {book ? "Chỉnh sửa sách" : "Thêm sách mới"}
            </h2>
          </div>
          <form id="form" onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    defaultValue={book ? book.title : ""}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tác giả *
                  </label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={book ? book.author : ""}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thể loại *
                  </label>
                  <select
                    defaultValue={book ? book.catalog?.id : ""}
                    name="catalog_id"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {categories?.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn ảnh bìa
                  </label>
                  <input
                    id="upload-file"
                    type="file"
                    name="image"
                    className="border border-gray-300 px-3 py-2 w-full rounded-lg"
                    onChange={() => {
                      const Url = URL.createObjectURL(
                        (
                          document.getElementById(
                            "upload-file"
                          ) as HTMLInputElement
                        ).files![0]
                      );
                      document
                        .querySelector("#imageTag")!
                        .setAttribute("src", Url);
                    }}
                  />
                </div>
              </div>
              <img
                id="imageTag"
                className="w-[100px] h-[100px] object-cover rounded-lg object-center"
                src={book ? book.image : ""}
                alt="ảnh bìa truyện"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                defaultValue={book ? book.description : ""}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                disabled={
                  updateBookMutation.isPending || createBookMutation.isPending
                }
              >
                {updateBookMutation.isPending || createBookMutation.isPending
                  ? "Đang lưu..."
                  : book
                  ? "Cập nhật sách"
                  : "Thêm sách"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSave = () => {};
  // const handleSave = (bookData: Omit<Book, "id">) => {
  // if (editingBook) {
  // setBooks(
  //   books.map((book) =>
  //     book.id === editingBook.id
  //       ? { ...bookData, id: editingBook.id }
  //       : book
  //   )
  // );
  // setEditingBook(null);
  // } else {
  // const newBook = {
  //     ...bookData,
  //     id: Date.now().toString(),
  //     availableCopies: bookData.totalCopies,
  //   };
  //   setBooks([...books, newBook]);
  //   setShowAddModal(false);
  // }
  // };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lí sách</h1>
          <p className="text-gray-600 mt-1">
            Quản lí và theo dõi sách trong thư viện của bạn.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm sách mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sách theo tiêu đề, tên tác giả,..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book: any) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-w-3 aspect-h-4 bg-gray-200">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 h-[55px]">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">Bởi {book.author}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {book.category}
                </span>
                <span>{book.publicationYear}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-600">
                  {book.catalog?.name || "N/A"}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    book.availableCopies > 0
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.availableCopies > 0 ? "Có sẵn" : "Tạm hết"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowBookItemsModal(true);
                    setViewingBook(book);
                  }}
                  className="cursor-pointer flex-1 flex items-center justify-center px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </button>
                <button
                  onClick={() => setEditingBook(book)}
                  className="cursor-pointer flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className=" cursor-pointer flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy sách</p>
          <p className="text-gray-400">
            Thử điều chỉnh thanh tìm kiếm và danh sách lọc
          </p>
        </div>
      )}
      {/* Pagination */}
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: "oklch(0.585 0.233 277.117)",
              colorBorder: "oklch(0.585 0.233 277.117)",
              colorPrimary: "white",
              colorPrimaryHover: "white",
              colorPrimaryBorder: "oklch(0.585 0.233 277.117)",
              colorText: "oklch(0.585 0.233 277.117)",
              controlOutline: "oklch(0.585 0.233 277.117)",
              itemSize: 36,
              borderRadius: 8,
              fontSize: 18,
            },
          },
        }}
      >
        <Pagination
          className="flex align-items-center justify-center mt-6 custom-pagination  "
          pageSize={size}
          total={getBookQuery.data.totalElements}
          current={page + 1}
          onChange={(currentPage: any) => {
            setPage(currentPage - 1);
            params.set("page", (currentPage - 1).toString());
            setCurrentParams(params);
          }}
        />
      </ConfigProvider>
      {/* Modals */}
      {showBookItemsModal && (
        <BookItems
          setModal={() => {
            setShowBookItemsModal(false);
          }}
          query={viewingBook ? viewingBook.id || 0 : 0}
          bookItems={getBookItemsByBookIdQuery.data}
        />
      )}
      {showAddModal && (
        <BookForm onSave={handleSave} onCancel={() => setShowAddModal(false)} />
      )}

      {editingBook && (
        <BookForm
          book={editingBook}
          onSave={handleSave}
          onCancel={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}
