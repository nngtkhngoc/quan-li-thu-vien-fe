/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, BookOpen, Heart, Share2, Clock } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookById } from "../../api/book.api";
import { createReview, getReviewByBookId } from "../../api/review.api";
import { useUser } from "../../hooks/useUser";
import { toast } from "react-toastify";
import { createBorrowedBook } from "../../api/borrow.api";
import axios, { AxiosError } from "axios";
import { addToWishlist, getWishlist } from "../../api/wishlist.api";
import BookDetailSkeleton from "../../components/Client/BookDetailedSkeleton";
const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isReserving, setIsReserving] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const user = useUser();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({
        queryKey: ["review", id],
      });
    },
    onError: e => {
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
    (e.currentTarget as HTMLFormElement).reset();
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

  // const bookReviews = mockReviews.filter((review) => review.bookId === book.id);

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
                          i < Math.floor(book.rating)
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
                  <button
                    onClick={handleReserve}
                    disabled={availableCopies === 0 || isReserving}
                    className={`cursor-pointer flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      availableCopies > 0
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    {isReserving
                      ? "Đang đặt..."
                      : availableCopies > 0
                      ? "Đặt sách"
                      : "Đã hết sách"}
                  </button>

                  <button
                    onClick={async () => {
                      if (!isAuthenticated) {
                        toast.error("Bạn cần đăng nhập để thêm vào yêu thích.");
                        return;
                      }
                      await addToWishlistMutation.mutateAsync({
                        book_id: book.id,
                        user_id: user.userProfile?.id || 0,
                      });
                    }}
                    disabled={isLiked}
                    className={`
    group flex items-center justify-center gap-2
    px-6 py-3 rounded-xl transition-all duration-300 ease-in-out
    text-sm font-semibold tracking-wide
    ${
      isLiked
        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white opacity-60 cursor-not-allowed"
        : "bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 text-white shadow-lg hover:brightness-110 hover:scale-105"
    }
    disabled:cursor-not-allowed
  `}
                  >
                    <Heart
                      className={`
      h-5 w-5 transition-transform duration-300
      ${
        isLiked
          ? "text-white"
          : "group-hover:scale-125 group-hover:text-yellow-200"
      }
    `}
                    />
                    {isLiked ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Đăng nhập để mượn sách
                </Link>
              )}

              <button className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Share2 className="h-5 w-5 mr-2" />
                Chia sẻ
              </button>
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
          {
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Bạn cần đăng nhập để viết đánh giá.");
                  return;
                }
                setShowReviewForm(!showReviewForm);
              }}
              className="px-4 py-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Viết đánh giá
            </button>
          }
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="mb-4">
              <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đánh giá
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setNewReview(prev => ({ ...prev, rating: star }))
                    }
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
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
                placeholder="Chia sẻ cảm nghĩ của bạn về cuốn sách này..."
                required
              />
            </div>

            <div className="flex space-x-3 ">
              <button
                type="submit"
                className="px-4 py-2 cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg hover:bg-gradient-to-bl transition-colors"
              >
                Đánh giá
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 cursor-pointer bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400/60  dark:hover:bg-gray-500 transition-colors duration-500"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 animate-gradient-x">
                  <div className=" w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt={review.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.user.name}
                    </h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
