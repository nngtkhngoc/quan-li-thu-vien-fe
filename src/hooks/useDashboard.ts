import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/book.api";

function useDashboard() {
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
  return { dashboard };
}

export default useDashboard;
