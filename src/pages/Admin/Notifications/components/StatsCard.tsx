import { Bell, CheckCircle, EyeOff } from "lucide-react";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconBgColor: string;
};

function StatItem({ icon, label, value, iconBgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center space-x-4 dark:bg-gray-900 dark:border-gray-800 ">
      <div className={`p-2 rounded-lg ${iconBgColor}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
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
        icon={<Bell className="h-5 w-5 text-blue-600 dark:text-blue-200" />}
        label="Tổng số"
        value={totalLength}
        iconBgColor="bg-blue-100 dark:bg-blue-500"
      />
      <StatItem
        icon={
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-200" />
        }
        label="Đã đọc"
        value={totalReadLength}
        iconBgColor="bg-green-100 dark:bg-green-500"
      />
      <StatItem
        icon={<EyeOff className="h-5 w-5 text-amber-600 dark:text-amber-200" />}
        label="Chưa đọc"
        value={totalUnreadLength}
        iconBgColor="bg-amber-100 dark:bg-amber-500"
      />
    </div>
  );
}
