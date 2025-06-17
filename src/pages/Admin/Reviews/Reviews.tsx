import { useMutation, useQuery } from "@tanstack/react-query";
import StatsCard from "./components/StatsCard";
import { deleteReviews, getAllReviews } from "../../../api/review.api";
import { useState } from "react";
import FilterBar from "./components/FilterBar";
import ReviewList from "./components/ReviewLists";

export default function Reviews() {
  const {
    data: totalReviews,
    isLoading: isTotalLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllReviews"],
    queryFn: () => getAllReviews(),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("All");
  const ratings = ["All", "5", "4", "3", "2", "1"];

  const filteredReviews =
    totalReviews?.data.items.filter((review) => {
      const matchesSearch =
        review.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        filterRating === "All" || review.rating.toString() === filterRating;

      return matchesSearch && matchesRating;
    }) || [];

  const deleteMutation = useMutation({
    mutationFn: deleteReviews,
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.error("Delete error", err);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá</h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và kiểm duyệt đánh giá của người dùng
          </p>
        </div>
      </div>

      {isTotalLoading ? (
        <p>Đang tải...</p>
      ) : (
        <StatsCard reviews={totalReviews?.data.items || []} />
      )}

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        ratings={ratings}
        filterRating={filterRating}
        setFilterRating={setFilterRating}
      />

      <ReviewList
        filteredReviews={filteredReviews}
        handleDelete={(id: BigInteger) =>
          deleteMutation.mutate({
            ids: [id],
          })
        }
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
