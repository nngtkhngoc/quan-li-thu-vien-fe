/* eslint-disable @typescript-eslint/no-explicit-any */
import { Award, Edit, Trash2 } from "lucide-react";
import type { Badge } from "../../../../types/Badge";

export default function BadgeGrid({
  filteredBadges,
  setDeleteBadge,
  setSelectedBadgeId,
  setShowEditModal,
}: {
  filteredBadges: Badge[];
  setDeleteBadge: any;
  setSelectedBadgeId: any;
  setShowEditModal: any;
}) {
  const categoryColors = {
    BOOK: "bg-blue-100 text-blue-800",
    COMMUNITY: "bg-emerald-100 text-emerald-800",
    ACHIEVEMENT: "bg-purple-100 text-purple-800",
  };

  if (!filteredBadges.length) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Không có huy hiệu nào</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredBadges.map((badge) => (
        <div
          key={badge.badge.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="h-[230px]">
            <div className="text-center mb-4 h-[100px]">
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

            <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2 h-[40px]">
              {badge.badge.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500">Điểm thưởng</p>
                <p className="font-semibold text-gray-900">
                  {badge.badge.xpAwarded}xp
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Sở hữu bởi</p>
                <p className="font-semibold text-gray-900">
                  {badge.users.length} độc giả
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowEditModal(badge.badge)}
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
