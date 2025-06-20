/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrowRight, Star } from "lucide-react";
import type { Review } from "../../../../types/Review";
import { Link } from "react-router-dom";

export default function RecentReviews({
  recentReviews,
}: {
  recentReviews: Review[];
}) {
  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8 ">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Đánh giá gần đây
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentReviews.map((review: Review, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex flex-col items-start gap-2 space-x-2 mb-2">
                  <div className="flex flex-row w-full justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.user.email}
                    </h4>

                    <Link
                      to={`/books/${review.book.id}`}
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
                    >
                      Xem sách
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Number(review.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-purple-600 dark:text-purple-300 mb-2 italic">
                  {review.book.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  "{review.comment}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
