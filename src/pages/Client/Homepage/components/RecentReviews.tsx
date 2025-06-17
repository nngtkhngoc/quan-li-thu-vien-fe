/* eslint-disable @typescript-eslint/no-explicit-any */

import { Star } from "lucide-react";
import type { Review } from "../../../../types/Review";

export default function RecentReviews({
  recentReviews,
}: {
  recentReviews: Review[];
}) {
  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8 ">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recent Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentReviews.map((review: Review, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.user.email}
                  </h4>
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
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {review.comment}
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
