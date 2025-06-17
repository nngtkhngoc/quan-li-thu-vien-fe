import { useQuery } from "@tanstack/react-query";
import { getAllBorrowedBooks } from "../api/borrow.api";

function useBorrow() {
  const { data: borrows, isLoading: isLoadingBorrows } = useQuery({
    queryKey: ["borrowed-books"],
    queryFn: getAllBorrowedBooks,
  });
  return { borrows, isLoadingBorrows };
}

export default useBorrow;
