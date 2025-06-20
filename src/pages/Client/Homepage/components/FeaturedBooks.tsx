/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import BookCard from "../../../../components/Client/BookCard";

export default function FeaturedBooks({
  loading,
  featuredBooks,
}: {
  loading: boolean;
  featuredBooks: any;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sách nổi bật
        </h2>
        <Link
          to="/books"
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
        >
          Xem tất cả
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBooks.map((book: any) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}
