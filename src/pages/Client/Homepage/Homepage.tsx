import { getBooks } from "../../../api/book.api";
import { getAllReviews } from "../../../api/review.api";
import FeaturedBooks from "./components/FeaturedBooks";
import HeroSection from "./components/HeroSection";
import HomepageSkeleton from "./components/HomepageSkeleton";
import RecentReviews from "./components/RecentReviews";
import StatsSection from "./components/StatsSection";

import { useQuery } from "@tanstack/react-query";

export default function Homepage() {
  const { data: totalBooks, isLoading: isBookLoading } = useQuery({
    queryKey: ["getAllBooks"],
    queryFn: () => getBooks(""),
  });

  const { data: totalReviews, isLoading: isReviewLoading } = useQuery({
    queryKey: ["getAllReviews"],
    queryFn: () => getAllReviews(),
  });

  const isLoading = isBookLoading || isReviewLoading;

  if (isLoading) return <HomepageSkeleton />;
  return (
    <div>
      <HeroSection />

      <div>
        <StatsSection
          totalBooks={totalBooks?.totalElements ?? 0}
          totalReviews={totalReviews?.data.totalItems ?? 0}
        />
        <FeaturedBooks
          featuredBooks={totalBooks.content.slice(0, 3)}
          loading={false}
        />
        <RecentReviews
          recentReviews={totalReviews?.data.items?.slice(0, 4) ?? []}
        />
      </div>
    </div>
  );
}
