import { getBooks } from "../../../api/book.api";
import { getAllReviews } from "../../../api/review.api";
import { getAllUsers } from "../../../api/user.api";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";

import { useQuery } from "@tanstack/react-query";

export default function Homepage() {
  const { data: totalUsers, isLoading: isUserLoading } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: () => getAllUsers(),
  });

  const { data: totalBooks, isLoading: isBookLoading } = useQuery({
    queryKey: ["getAllBooks"],
    queryFn: () => getBooks(""),
  });

  const { data: totalReviews, isLoading: isReviewLoading } = useQuery({
    queryKey: ["getAllReviews"],
    queryFn: () => getAllReviews(),
  });

  return (
    <div>
      <HeroSection />
      {isUserLoading || isBookLoading || isReviewLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <StatsSection
          totalBooks={totalBooks?.totalElements ?? 0}
          totalUsers={totalUsers?.length ?? 0}
          totalReviews={totalReviews?.data.totalItems ?? 0}
        />
      )}
    </div>
  );
}
