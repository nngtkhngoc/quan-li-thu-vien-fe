/* eslint-disable @typescript-eslint/no-unused-vars */
import { Users, BookOpen, Star } from "lucide-react";

export default function StatsSection({
  totalBooks,
  totalUsers,
  totalReviews,
}: {
  totalBooks: number;
  totalUsers: number;
  totalReviews: number;
}) {
  const stats = [
    {
      icon: BookOpen,
      label: "cuốn sách",
      value: totalBooks,
    },
    { icon: Users, label: "độc giả", value: totalUsers },
    {
      icon: Star,
      label: "đánh giá",
      value: totalReviews,
    },
  ];
  return (
    <section className="grid grid-cols-3 gap-6 py-10">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-800 rounded-2xl py-6 px-8    text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {value}+
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      ))}
    </section>
  );
}
