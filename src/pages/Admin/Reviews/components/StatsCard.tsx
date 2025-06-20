/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star } from "lucide-react";

export default function StatsCard({ reviews }: { reviews: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div
          key={rating}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-600">
                {rating} sao
              </span>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              {
                reviews.filter((r: { rating: number }) => r.rating === rating)
                  .length
              }
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
