import { useQuery } from "@tanstack/react-query";
import { getAllBorrowedBooks } from "../api/borrow.api";

function useBorrow() {
  const { data: borrows } = useQuery({
    queryKey: ["borrowed-books"],
    queryFn: getAllBorrowedBooks,
  });
  return { borrows };
}

export default useBorrow;
