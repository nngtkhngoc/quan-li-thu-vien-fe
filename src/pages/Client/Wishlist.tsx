import React, { useContext, useEffect, useState } from "react";
import { getWishlist } from "../../api/wishlist.api";
import BookCard from "../../components/Client/BookCard";
import { UserContext } from "../../contexts/userContext";
import type { BookResponse } from "../../types/Book";
import type { UserResponse } from "../../types/User";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import type { AnimationGeneratorType } from "framer-motion";

interface WishlistItem {
  id: number;
  user: UserResponse;
  book: BookResponse;
}

const BookCardSkeleton = () => (
  <div className="group bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="relative">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="p-6">
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex space-x-2">
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  </div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      y: {
        type: "spring" as AnimationGeneratorType,
        stiffness: 80,
        damping: 18,
      },
    },
  }),
};

const Wishlist: React.FC = () => {
  const userContext = useContext(UserContext);
  const userId = userContext?.userProfile?.id;
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        setLoading(false);
        setWishlist([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getWishlist(userId);
        setWishlist(data);
      } catch {
        setError("Không thể tải danh sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [userId]);

  return (
    <div className="min-h-screen from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8 px-2">
      <div className="container mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
          Danh sách yêu thích
        </h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            {error}
            <div className="flex justify-center mt-4">
              <LoadingSpinner size="md" />
            </div>
          </div>
        ) : !wishlist || wishlist.length === 0 ? (
          <div className="text-center py-10 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Bạn chưa có sách nào trong danh sách yêu thích.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{}}
          >
            <AnimatePresence>
              {wishlist.map((item, idx) => (
                <motion.div
                  key={item.book.id}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="will-change-transform"
                  whileHover={{
                    scale: 1.04,
                    y: -8,
                    boxShadow: "0 8px 32px 0 rgba(80, 63, 205, 0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookCard key={item.book.id} book={item.book} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
