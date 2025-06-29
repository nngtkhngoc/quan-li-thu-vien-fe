import { Trophy } from "lucide-react";
import { getAllUsersByXpDesc } from "../../../api/user.api";
import { useQuery } from "@tanstack/react-query";
import LeaderboardRow from "./components/LeaderboardRow";
import LeaderboardRowSkeleton from "./components/LeaderboardRowSkeleton";

export default function Leaderboard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["usersByXp"],
    queryFn: getAllUsersByXpDesc,
  });

  return (
    <div className="flex flex-col gap-10 w-full items-center justify-center">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bảng xếp hạng
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full justify-center items-center">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <LeaderboardRowSkeleton key={i} />
            ))
          : users?.map((user, index) => (
              <LeaderboardRow player={user} index={index + 1} key={user.id} />
            ))}
      </div>
    </div>
  );
}
