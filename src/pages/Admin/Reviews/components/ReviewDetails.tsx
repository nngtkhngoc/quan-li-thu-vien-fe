/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Review } from "../../../../types/Review";
import { StarRating } from "./StarRating";

export default function ReviewDetailsModal({
  review,
  onClose,
}: {
  review: Review;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết đánh giá
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Người đánh giá
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {review.user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Sách
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {review.book.title}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Đánh giá
              </label>
              <div className="flex items-center space-x-2">
                <StarRating
                  rating={
                    typeof review.rating === "number"
                      ? review.rating
                      : Number(review.rating)
                  }
                />
                <span className="text-sm font-medium text-gray-700">
                  {review.rating}/5
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Ngày đánh giá
              </label>
              <p className="text-gray-900">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Nhận xét
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 leading-relaxed">{review.comment}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
