import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BookOpen,
  Users,
  ArrowRightLeft,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Star,
} from "lucide-react";

import useDashboard from "../../../hooks/useDashboard";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../../api/user.api";

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p
            className={`text-sm mt-2 flex items-center ${
              changeType === "positive"
                ? "text-emerald-600"
                : changeType === "negative"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {change}
          </p>
        )}
      </div>
      <div className="p-3 bg-indigo-100 rounded-lg">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { dashboard } = useDashboard();
  const { data: users } = useQuery({
    queryFn: getAllUsers,
    queryKey: ["users"],
  });
  // const overdueBooks = borrows?.filter(borrow => borrow.status === "OVERDUE");

  // Mapping tháng tiếng Anh sang tiếng Việt
  const monthTranslation: Record<string, string> = {
    Jan: "Th1",
    Feb: "Th2",
    Mar: "Th3",
    Apr: "Th4",
    May: "Th5",
    Jun: "Th6",
    Jul: "Th7",
    Aug: "Th8",
    Sep: "Th9",
    Oct: "Th10",
    Nov: "Th11",
    Dec: "Th12",
  };

  // Việt hóa dữ liệu monthlyBorrows
  const vietnameseMonthlyBorrows = dashboard?.monthlyBorrows?.map(
    (item: { month: string; borrows: number }) => ({
      ...item,
      month: monthTranslation[item.month] || item.month,
    })
  );

  // Array of colors for pie chart cells
  const pieColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
    "#dda0dd",
    "#98fb98",
    "#f0e68c",
    "#ff6347",
    "#40e0d0",
    "#ee82ee",
    "#90ee90",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600 mt-1">
            Chào mừng trở lại! Đây là những gì đang diễn ra tại thư viện của
            bạn.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số sách"
          value={dashboard?.totalBooks.toLocaleString()}
          icon={BookOpen}
          change="+12 trong tháng này"
          changeType="positive"
        />
        <StatCard
          title="Người dùng hoạt động"
          value={users?.length || 0}
          icon={Users}
          change="+5.2% so với tháng trước"
          changeType="positive"
        />
        <StatCard
          title="Sách đang cho mượn"
          value={dashboard?.activeBorrows}
          icon={ArrowRightLeft}
          change="+5 từ hôm qua"
          changeType="positive"
        />
        <StatCard
          title="Sách quá hạn"
          value={dashboard?.overdueBooks}
          icon={AlertTriangle}
          change="2 đã trả hôm nay"
          changeType="positive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Borrows Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Mượn sách theo tháng
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />6 tháng gần đây
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vietnameseMonthlyBorrows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis dataKey="borrows" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="borrows" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-visible">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Danh mục sách
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 mr-1" />
              Phân bố
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboard?.categoryDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {dashboard?.categoryDistribution.map(
                  (_entry: { name: string; value: number }, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
    </div>
  );
}
