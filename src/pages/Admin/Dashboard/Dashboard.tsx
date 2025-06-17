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
  Trophy,
} from "lucide-react";

import useBorrow from "../../../hooks/useBorrow";
import useDashboard from "../../../hooks/useDashboard";
import { dashboardStats } from "../../../data/mockData";

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
  const { borrows } = useBorrow();
  const { dashboard } = useDashboard();
  console.log(dashboard);
  const overdueBooks = borrows?.filter(borrow => borrow.status === "OVERDUE");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening at your library.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={dashboard?.totalBooks.toLocaleString()}
          icon={BookOpen}
          change="+12 this month"
          changeType="positive"
        />
        <StatCard
          title="Active Users"
          value={dashboardStats.totalUsers.toLocaleString()}
          icon={Users}
          change="+5.2% from last month"
          changeType="positive"
        />
        <StatCard
          title="Active Borrows"
          value={dashboard?.activeBorrows}
          icon={ArrowRightLeft}
          change="-3 from yesterday"
          changeType="negative"
        />
        <StatCard
          title="Overdue Books"
          value={dashboard?.overdueBooks}
          icon={AlertTriangle}
          change="2 returned today"
          changeType="positive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Borrows Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Monthly Borrows
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Last 6 months
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard?.monthlyBorrows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Book Categories
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 mr-1" />
              Distribution
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboard?.categoryDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {dashboard?.categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    // fill={entry.color}
                  />
                ))}
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
