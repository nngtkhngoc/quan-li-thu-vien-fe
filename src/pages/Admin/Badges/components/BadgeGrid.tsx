/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, Trash2 } from "lucide-react";
import type { Badge } from "../../../../types/Badge";

export default function BadgeGrid({
  filteredBadges,
  setEditingBadge,
  setDeleteBadge,
  setSelectedBadgeId,
}: {
  filteredBadges: Badge[];
  setEditingBadge: any;
  setDeleteBadge: any;
  setSelectedBadgeId: any;
}) {
  const categoryColors = {
    BOOK: "bg-blue-100 text-blue-800",
    COMMUNITY: "bg-emerald-100 text-emerald-800",
    ACHIEVEMENT: "bg-purple-100 text-purple-800",
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredBadges.map((badge) => (
        <div
          key={badge.badge.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{badge.badge.icon_url}</div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {badge.badge.name}
            </h3>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                categoryColors[
                  badge.badge.category as keyof typeof categoryColors
                ]
              }`}
            >
              {badge.badge.category === "BOOK" && "Đọc sách"}
              {badge.badge.category === "COMMUNITY" && "Cộng đồng"}
              {badge.badge.category === "ACHIEVEMENT" && "Thành tựu"}
            </span>
          </div>

          <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
            {badge.badge.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Yêu cầu XP</p>
              <p className="font-semibold text-gray-900">
                {badge.badge.xpRequired}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Được sở hữu</p>
              <p className="font-semibold text-gray-900">
                {badge.users.length} độc giả
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setEditingBadge(badge)}
              className="cursor-pointer flex-1 flex items-center justify-center px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors text-sm"
            >
              <Edit className="h-4 w-4 mr-1" />
              Sửa
            </button>
            <button
              onClick={() => {
                setDeleteBadge(true);
                setSelectedBadgeId(badge.badge.id);
              }}
              className="flex cursor-pointer items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
