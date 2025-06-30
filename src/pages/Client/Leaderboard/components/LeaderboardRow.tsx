import React from "react";
import { Crown } from "lucide-react";
import type { UserResponse } from "../../../../types/User";

interface LeaderboardRowProps {
  player: UserResponse;
  index: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ player, index }) => {
  const getOrderIcon = (order: number) => {
    switch (order) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;

      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">#{order}</span>
          </div>
        );
    }
  };

  const getRowStyle = (order: number) => {
    switch (order) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-100 border-l-4 border-yellow-400 shadow-lg dark:from-yellow-100 dark:to-amber-200";
      case 2:
        return "bg-gradient-to-r from-green-50 to-emerald-100 border-l-4 border-green-400 shadow-lg dark:from-green-100 dark:to-emerald-200";
      case 3:
        return "bg-gradient-to-r from-indigo-50 to-blue-100 border-l-4 border-indigo-400 shadow-lg dark:from-indigo-100 dark:to-blue-200";
      default:
        return "bg-white border-l-4 border-transparent hover:border-indigo-200 shadow-sm dark:bg-gray-100";
    }
  };

  return (
    <div
      className={`${getRowStyle(
        index
      )} rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer group w-full md:w-1/2`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center">
            {getOrderIcon(index)}
          </div>

          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 via-indigo-400 ${player.image} flex items-center justify-center shadow-lg`}
          >
            {player.image ? (
              <img
                src={player.image}
                alt="avt"
                className="w-full aspect-square object-cover rounded-full"
              />
            ) : (
              <span className="text-white font-bold text-lg">
                {player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {player.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">
            {player.xp.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">XP</div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRow;
