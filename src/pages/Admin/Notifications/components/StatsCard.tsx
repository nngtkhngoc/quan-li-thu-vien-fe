import { Bell, CheckCircle, EyeOff } from "lucide-react";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconBgColor: string;
};

function StatItem({ icon, label, value, iconBgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center space-x-4">
      <div className={`p-2 rounded-lg ${iconBgColor}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function StatsCard({
  totalLength,
  totalUnreadLength,
  totalReadLength,
}: {
  totalLength: number;
  totalUnreadLength: number;
  totalReadLength: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <StatItem
        icon={<Bell className="h-5 w-5 text-blue-600" />}
        label="Tổng số"
        value={totalLength}
        iconBgColor="bg-blue-100"
      />
      <StatItem
        icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        label="Đã đọc"
        value={totalReadLength}
        iconBgColor="bg-green-100"
      />
      <StatItem
        icon={<EyeOff className="h-5 w-5 text-amber-600" />}
        label="Chưa đọc"
        value={totalUnreadLength}
        iconBgColor="bg-amber-100"
      />
    </div>
  );
}
