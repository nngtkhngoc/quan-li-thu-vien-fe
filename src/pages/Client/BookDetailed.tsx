import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Calendar,
  User,
  Heart,
  Share2,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../../api/book.api";
import { getReviewByBookId, getReviewById } from "../../api/review.api";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [isReserving, setIsReserving] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

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
  const isAuthenticated = true; // Replace with actual authentication check
  if (getBookByIdQuery.isLoading || getReviewsQuery.isLoading) {
    return <div className="flex justify-center py-12">Loading</div>;
  }
  console.log(getBookByIdQuery, "getBookItemByIdQuery");
  const book = getBookByIdQuery.data;
  const reviews = getReviewsQuery.data.data.items || [];
  console.log(reviews, "reviews");
  const handleReserve = async () => {
    if (!isAuthenticated) return;

    setIsReserving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsReserving(false);
    alert("Book reserved successfully!");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: "" });
    alert("Review submitted successfully!");
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
        <Link to="/catalogue" className="text-blue-600 hover:text-blue-700">
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
        to="/catalogue"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Catalogue
      </Link>

      {/* Book Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <img
              src={book.image || ""}
              alt={book.title}
              className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
            />
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                by {book.author}
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
                    {/* {book.availableCopies}/{book.totalCopies} available */}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {book.category}
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Published {book.publishedYear}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  {/* <span>ISBN: {book.isbn}</span> */}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleReserve}
                    disabled={book.availableCopies === 0 || isReserving}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      book.availableCopies > 0
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    {isReserving
                      ? "Reserving..."
                      : book.availableCopies > 0
                      ? "Reserve Book"
                      : "Unavailable"}
                  </button>

                  <button className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Heart className="h-5 w-5 mr-2" />
                    Thêm vào yêu thích
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
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Viết đánh giá
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setNewReview((prev) => ({ ...prev, rating: star }))
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Share your thoughts about this book..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đánh giá
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
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
                {/* <img
                  // src={review.user.}
                  alt={review.u}
                  className="w-12 h-12 rounded-full object-cover"
                /> */}
                {/* <h2 className="">{review.user.name}</h2> */}
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
                      {new Date(review.date).toLocaleDateString()}
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
