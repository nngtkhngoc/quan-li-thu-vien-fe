/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { useState, useRef } from "react";
import { Upload, X, Star, Eye, Heart } from "lucide-react";
import { getSimilarBooks } from "../../api/book.api";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<any[]>([]);
  // Mock book data - in a real app, this would come from an API

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    console.log("Selected file:", file);
    if (file) {
      const Url = URL.createObjectURL(file);
      setUploadedImage(Url);
      fetchSimilarBooks();
    }
  };

  const fetchSimilarBooks = async () => {
    setIsLoading(true);
    setShowResults(false);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await getSimilarBooks(formData);
      setBooks(response);
      console.log("Similar books:", response);
      setShowResults(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching similar books:", error);
    }
  };
  const clearImage = () => {
    console.log("Clearing image");
    setUploadedImage(null);
    setShowResults(false);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Tìm kiếm sách theo ảnh
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tải ảnh bìa sách hoặc ảnh liên quan để tìm kiếm những cuốn sách
            tương tự. Hãy thử ngay!
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              isDragging
                ? "border-purple-500 bg-purple-50 scale-105 dark:bg-purple-900"
                : uploadedImage
                ? "border-green-500 dark:bg-green-900 bg-green-50"
                : "border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-600 dark:hover:bg-purple-900 bg-white hover:border-purple-400 hover:bg-purple-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white dark:text-gray-900 rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4 dark:text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Tải ảnh bìa sách hoặc ảnh liên quan
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Kéo và thả ảnh vào đây hoặc nhấn nút bên dưới để tải ảnh lên.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Tải ảnh lên
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-lg text-gray-600">Đang phân tích ảnh...</p>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Những quyển sách tương tự
              </h2>
              <p className="text-gray-600">
                Dựa vào ảnh bạn đã tải lên, chúng tôi tìm thấy những cuốn sách
                phù hợp với sở thích của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Link to={`/books/${book.id}`} key={book.id}>
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="relative">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        {/* {book.similarity}% match */}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-sm">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>Đọc ngay</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-3">by {book.author}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {book.rating}
                          </span>
                        </div>
                        <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {book.genre}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-sm">
                          Xem chi tiết
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
