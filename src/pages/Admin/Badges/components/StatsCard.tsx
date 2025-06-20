import { Award, Trophy, Users } from "lucide-react";
import type { Badge } from "../../../../types/Badge";

export default function StatsCard({ badges }: { badges: Badge[] }) {
  const categories = [
    {
      key: "BOOK",
      label: "Đọc sách",
      icon: <Trophy className="h-7 w-7 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      key: "COMMUNITY",
      label: "Cộng đồng",
      icon: <Users className="h-7 w-7 text-emerald-600" />,
      bg: "bg-emerald-100",
    },
    {
      key: "ACHIEVEMENT",
      label: "Thành tựu",
      icon: <Award className="h-7 w-7 text-purple-600" />,
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categories.map((cat) => {
        const count = badges.filter((b) => b.badge.category === cat.key).length;
        return (
          <div
            key={cat.key}
            className="bg-white rounded-lg border border-gray-200 px-4 py-6"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${cat.bg}`}>{cat.icon}</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{cat.label}</p>
                <p className="text-xl font-semibold text-gray-900">{count}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
