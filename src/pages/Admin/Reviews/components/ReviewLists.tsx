import { Eye, Trash2 } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Review } from "../../../../types/Review";
import { useState } from "react";
import ReviewDetailsModal from "./ReviewDetails";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ReviewList({
  filteredReviews,
  handleDelete,
  setShowDeleteModal,
}: {
  filteredReviews: any;
  handleDelete: any;
  setShowDeleteModal: any;
}) {
  const [viewingReview, setViewingReview] = useState<Review | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredReviews.map((review: Review, index: number) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {review.user.email}
                </h3>
                <StarRating rating={Number(review.rating)} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{review.book.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewingReview(review)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Xem chi tiết"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  handleDelete(review.review_id);
                  setShowDeleteModal(true);
                }}
                className="text-red-400 hover:text-red-600 cursor-pointer"
                title="Xóa đánh giá"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
      {viewingReview && (
        <ReviewDetailsModal
          review={viewingReview}
          onClose={() => setViewingReview(null)}
        />
      )}
    </div>
  );
}
