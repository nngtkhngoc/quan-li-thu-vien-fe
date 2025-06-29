/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Heart,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookById } from "../../api/book.api";
import { createReview, getReviewByBookId } from "../../api/review.api";
import { useUser } from "../../hooks/useUser";
import { toast } from "react-toastify";
import {
  createBorrowedBook,
  getAllBorrowedBooks,
  deleteBorrowedBook,
} from "../../api/borrow.api";
import {
  createReservation,
  getMyReservation,
  deleteReservation,
} from "../../api/reservation.api";
import axios, { AxiosError } from "axios";
import {
  addToWishlist,
  getWishlist,
  deleteWishlist,
} from "../../api/wishlist.api";
import BookDetailSkeleton from "../../components/Client/BookDetailedSkeleton";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isReserving, setIsReserving] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [, setShowReviewForm] = useState(false);
  const user = useUser();
  const queryClient = useQueryClient();

  // Query to get user's borrowed books
  const getUserBorrowedBooksQuery = useQuery({
    queryKey: ["user-borrowed-books", user.userProfile?.id],
    queryFn: async () => {
      return await getAllBorrowedBooks();
    },
    enabled: !!user.userProfile?.id,
  });

  // Query to get user's reservations
  const getUserReservationsQuery = useQuery({
    queryKey: ["user-reservations", user.userProfile?.id],
    queryFn: async () => {
      return await getMyReservation();
    },
    enabled: !!user.userProfile?.id,
  });

  // Get the specific borrowed book record for this book
  const borrowedBookRecord = getUserBorrowedBooksQuery?.data?.find(
    (borrow: any) =>
      borrow.book_item?.book?.id === parseInt(id || "0") &&
      (borrow.status === "BORROWED" || borrow.status === "PENDING")
  );

  // Get the specific reservation record for this book
  const reservationRecord = getUserReservationsQuery?.data?.find(
    (reservation: any) =>
      reservation.book?.id === parseInt(id || "0") && !reservation.returned
  );

  // Check if user has borrowed this book
  const hasBorrowed = !!borrowedBookRecord;

  // Check if user has reserved this book
  const hasReserved = !!reservationRecord;

  const getWishListQuery = useQuery({
    queryKey: ["wishlist", user.userProfile?.id],
    queryFn: async () => {
      return await getWishlist(user.userProfile?.id || 0);
    },
    enabled: !!user.userProfile?.id,
  });
  const isLiked = getWishListQuery?.data?.find(
    (item: any) => item?.book.id === parseInt(id || "0")
  );
  console.log("isLiked:", getWishListQuery.data);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const addToWishlistMutation = useMutation({
    mutationFn: async (data: any) => {
      return await addToWishlist({
        book_id: data.book_id,
        user_id: data.user_id,
      });
    },
    onSuccess: () => {
      toast.success("Đã thêm vào danh sách yêu thích!");
      queryClient.invalidateQueries({
        queryKey: ["wishlist", user.userProfile?.id],
      });
    },
    onError: (e: AxiosError) => {
      console.error("Error adding to wishlist:", e);
      toast.error(
        "Thêm vào danh sách yêu thích thất bại. Vui lòng thử lại sau."
      );
    },
  });

  // Mutation to cancel borrowed book
  const cancelBorrowMutation = useMutation({
    mutationFn: async (borrowId: number) => {
      return await deleteBorrowedBook(borrowId);
    },
    onSuccess: () => {
      toast.success("Đã hủy mượn sách thành công!");
      queryClient.invalidateQueries({
        queryKey: ["user-borrowed-books", user.userProfile?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["book", id],
      });
    },
    onError: () => {
      toast.error("Hủy mượn sách thất bại. Vui lòng thử lại sau.");
    },
  });

  // Mutation to cancel reservation
  const cancelReservationMutation = useMutation({
    mutationFn: async (reservationId: number) => {
      return await deleteReservation(reservationId);
    },
    onSuccess: () => {
      toast.success("Đã hủy đặt trước thành công!");
      queryClient.invalidateQueries({
        queryKey: ["user-reservations", user.userProfile?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["book", id],
      });
    },
    onError: () => {
      toast.error("Hủy đặt trước thất bại. Vui lòng thử lại sau.");
    },
  });

  const getBookByIdQuery = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      return await getBookById(id ? parseInt(id) : 0);
    },
  });
  const getReviewsQuery = useQuery({
    queryKey: ["review", id],
    queryFn: async () => {
      return await getReviewByBookId(id ? parseInt(id) : 0);
    },
  });
  const createBorrowMutation = useMutation({
    mutationFn: async (data: any) => {
      return createBorrowedBook({
        user_id: user.userProfile?.id || 0,
        book_item_id: data.book_item_id,
      });
    },
    onSuccess: () => {
      toast.success("Đặt sách thành công!");
      queryClient.invalidateQueries({
        queryKey: ["book", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-borrowed-books", user.userProfile?.id],
      });
    },
    onError: () => {
      toast.error("Đặt sách thất bại. Vui lòng thử lại sau.");
    },
  });
  const createReviewMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createReview({
        user_id: user.userProfile?.id || 0,
        book_id: id ? parseInt(id) : 0,
        rating: data.rating,
        comment: data.comment,
      });
    },
    onSuccess: () => {
      toast.success("Đánh giá đã được gửi thành công!");
      queryClient.invalidateQueries({ queryKey: ["review", id] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });
    },
    onError: (e) => {
      console.error("Error creating review:", e);
      if (axios.isAxiosError(e)) {
        toast.error(
          e.response?.data?.message ||
            "Đánh giá thất bại. Vui lòng thử lại sau."
        );
      } else {
        toast.error("Đánh giá thất bại. Vui lòng thử lại sau.");
      }
    },
  });
  const createReservationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createReservation(data);
    },
    onSuccess: () => {
      toast.success("Đặt trước thành công!");
      queryClient.invalidateQueries({
        queryKey: ["book", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-reservations", user.userProfile?.id],
      });
    },
    onError: (error: any) => {
      if (error?.response?.data?.message?.includes("already exists")) {
        toast.error("Bạn đã đặt trước rồi");
      } else {
        toast.error("Đặt trước thất bại. Vui lòng thử lại sau.");
      }
    },
  });
  const isAuthenticated = user.userProfile;

  if (getBookByIdQuery.isLoading || getReviewsQuery.isLoading) {
    return <BookDetailSkeleton />;
  }
  const book = getBookByIdQuery.data;
  const reviews = getReviewsQuery.data.data.items || [];

  const availableCopies =
    book?.bookItems.reduce((count: number, item: any) => {
      return count + (item.status === "AVAILABLE" ? 1 : 0);
    }, 0) || 0;

  const handleReserve = async () => {
    if (!isAuthenticated) return;
    console.log("Reserving book:@");
    if (availableCopies === 0) {
      toast.error("Không còn bản sách nào có sẵn để đặt.");
      return;
    }
    console.log(availableCopies);
    setIsReserving(true);
    try {
      await createBorrowMutation.mutateAsync({
        book_item_id: book.bookItems.find(
          (item: any) => item.status === "AVAILABLE"
        ).id,
        user_id: user.userProfile?.id || 0,
      });
    } catch (error) {
      console.error("Error reserving book:", error);
    }
    setIsReserving(false);
  };

  const handleReservation = async () => {
    if (!isAuthenticated) return;
    if (!book.bookItems || book.bookItems.length === 0) {
      toast.error("Không có bản sách nào để đặt trước.");
      return;
    }
    try {
      await createReservationMutation.mutateAsync({
        user_id: user.userProfile?.id,
        book_id: book.id, // lấy bản đầu tiên, có thể cải tiến chọn bản phù hợp
      });
    } catch (error) {
      console.error("Error reserving book:", error);
    }
  };

  const handleCancelBorrow = async () => {
    if (!borrowedBookRecord) return;

    await cancelBorrowMutation.mutateAsync(borrowedBookRecord.id);
  };

  const handleCancelReservation = async () => {
    if (!reservationRecord) return;
    await cancelReservationMutation.mutateAsync(
      reservationRecord.reservation_id
    );
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }
    setIsWishlistLoading(true);
    await addToWishlistMutation.mutateAsync({
      book_id: book.id,
      user_id: user.userProfile?.id || 0,
    });
    setIsWishlistLoading(false);
  };

  const handleRemoveFromWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để bỏ yêu thích.");
      return;
    }
    setIsWishlistLoading(true);
    try {
      await deleteWishlist({
        book_id: book.id,
        user_id: user.userProfile?.id || 0,
      });
      toast.success("Đã bỏ khỏi danh sách yêu thích!");
      queryClient.invalidateQueries({
        queryKey: ["wishlist", user.userProfile?.id],
      });
    } catch {
      toast.error("Bỏ yêu thích thất bại. Vui lòng thử lại sau.");
    }
    setIsWishlistLoading(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const rating = newReview.rating || 5;
    const comment = formData.get("comment");

    try {
      await createReviewMutation.mutateAsync({
        rating: rating,
        comment: comment ? comment.toString() : "",
        user_id: user.userProfile?.id || 0,
        book_id: id ? parseInt(id) : 0,
      });
    } catch (error) {
      console.log("Error creating review:", error);
    }

    const form = document.querySelector("#review-form") as HTMLFormElement;
    form?.reset();
    setNewReview({ rating: 5, comment: "" });
  };

  if (getBookByIdQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Đang tải thông tin sách...
        </h2>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Không tìm thấy sách
        </h2>
        <Link to="/books" className="text-blue-600 hover:text-blue-700">
          ← Trở về danh mục sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-screen-xl">
      {/* Back Navigation */}
      <Link
        to="/books"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Trở về danh mục sách
      </Link>

      {/* Book Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <img
              src={book.image || ""}
              alt={book.title}
              className="w-full max-w-sm mx-auto rounded-2xl shadow-md"
            />
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                Bởi {book.author}
              </p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(book.avg_rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {/* {book.rating} */}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {/* ({book.reviewCount} reviews) */}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span>
                    {availableCopies}/{book.bookItems?.length || 0} bản có sẵn
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {book.catalog?.name || "Không có danh mục"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  {hasBorrowed ? (
                    <button
                      onClick={handleCancelBorrow}
                      disabled={cancelBorrowMutation.isPending}
                      className="cursor-pointer flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {cancelBorrowMutation.isPending
                        ? "Đang hủy..."
                        : "Hủy mượn sách"}
                    </button>
                  ) : hasReserved ? (
                    <button
                      onClick={handleCancelReservation}
                      disabled={cancelReservationMutation.isPending}
                      className="cursor-pointer flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      {cancelReservationMutation.isPending
                        ? "Đang hủy..."
                        : "Hủy đặt trước"}
                    </button>
                  ) : availableCopies > 0 ? (
                    <button
                      onClick={handleReserve}
                      disabled={isReserving}
                      className={`cursor-pointer flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1`}
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      {isReserving ? "Đang đặt..." : "Đặt sách"}
                    </button>
                  ) : (
                    <button
                      onClick={handleReservation}
                      disabled={createReservationMutation.isPending}
                      className={`cursor-pointer flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg transform hover:-translate-y-1`}
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      {createReservationMutation.isPending
                        ? "Đang đặt trước..."
                        : "Đặt trước"}
                    </button>
                  )}

                  {isLiked ? (
                    <button
                      onClick={handleRemoveFromWishlist}
                      disabled={isWishlistLoading}
                      className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ease-in-out text-sm font-semibold tracking-wide bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg hover:brightness-110 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Heart className="h-5 w-5 text-white" />
                      {isWishlistLoading ? "Đang xử lý..." : "Bỏ yêu thích"}
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToWishlist}
                      disabled={isWishlistLoading}
                      className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ease-in-out text-sm font-semibold tracking-wide bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 text-white shadow-lg hover:brightness-110 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Heart className="h-5 w-5 group-hover:scale-125 group-hover:text-yellow-200" />
                      {isWishlistLoading
                        ? "Đang xử lý..."
                        : "Thêm vào yêu thích"}
                    </button>
                  )}
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Đăng nhập để mượn sách
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Book Description */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Về quyển sách
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
          {book.description}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {/* Reviews ({bookReviews.length}) */}
          </h2>
        </div>

        {/* Review Form */}
        {isAuthenticated && (
          <form
            id="review-form"
            onSubmit={handleReviewSubmit}
            className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="mb-4">
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đánh giá
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setNewReview((prev) => ({ ...prev, rating: star }))
                    }
                    className="p-1 "
                  >
                    <Star
                      className={`h-6 w-6 cursor-pointer ${
                        star <= newReview.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bình luận của bạn
              </label>
              <textarea
                name="comment"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Chia sẻ cảm nhận của bạn về quyển sách này..."
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={createReviewMutation.isPending}
                className="px-4 py-2 cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg hover:bg-gradient-to-bl transition-colors disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                {createReviewMutation.isPending ? "Đang xử lý..." : "Đánh giá"}
              </button>
              <button
                type="button"
                onClick={() => setNewReview({ rating: 5, comment: "" })}
                className="px-4 py-2 cursor-pointer bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400/60  dark:hover:bg-gray-500 transition-colors duration-500"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center text-gray-400 italic py-8">
              Chưa có đánh giá nào cho quyển sách này.
            </div>
          ) : (
            reviews.map((review: any) => (
              <div
                key={review.id}
                className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-100 dark:border-gray-800"
              >
                {/* Avatar + User */}
                <div className="flex-shrink-0 flex flex-col items-center w-16">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                      {review.user.image ? (
                        <img
                          src={review.user.image}
                          alt={review.user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {new Date(
                      review.createdAt || review.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>
                {/* Nội dung đánh giá */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white text-base">
                      {review.user.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed break-words">
                    {review.comment}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
