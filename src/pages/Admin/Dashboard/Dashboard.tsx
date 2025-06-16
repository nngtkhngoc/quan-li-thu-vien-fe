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

const dashboardStats = {
  totalBooks: 847,
  totalUsers: 1234,
  activeBorrows: 89,
  overdueBooks: 12,
  monthlyBorrows: [
    { month: "Jan", borrows: 120 },
    { month: "Feb", borrows: 98 },
    { month: "Mar", borrows: 145 },
    { month: "Apr", borrows: 132 },
    { month: "May", borrows: 156 },
    { month: "Jun", borrows: 134 },
  ],
  categoryDistribution: [
    { name: "Fiction", value: 35, color: "#4F46E5" },
    { name: "Technology", value: 25, color: "#059669" },
    { name: "Science", value: 20, color: "#D97706" },
    { name: "History", value: 15, color: "#DC2626" },
    { name: "Other", value: 5, color: "#6B7280" },
  ],
};
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
          value={dashboardStats.totalBooks.toLocaleString()}
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
          value={dashboardStats.activeBorrows}
          icon={ArrowRightLeft}
          change="-3 from yesterday"
          changeType="negative"
        />
        <StatCard
          title="Overdue Books"
          value={dashboardStats.overdueBooks}
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
            <BarChart data={dashboardStats.monthlyBorrows}>
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
                data={dashboardStats.categoryDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {dashboardStats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Books Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Overdue Books
            </h2>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {overdueBooks?.length} items
            </span>
          </div>
          <div className="space-y-3">
            {overdueBooks?.slice(0, 5).map(borrow => (
              <div
                key={borrow.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {borrow.book_item.book.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Borrowed by {borrow.user.name}
                  </p>
                  <p className="text-xs text-red-600">
                    Due: {new Date(borrow.return_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {overdueBooks?.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-gray-500">No overdue books! Great job!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors">
              <BookOpen className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-indigo-700">
                Add Book
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors">
              <Users className="h-6 w-6 text-emerald-600 mb-2" />
              <span className="text-sm font-medium text-emerald-700">
                Add User
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors">
              <ArrowRightLeft className="h-6 w-6 text-amber-600 mb-2" />
              <span className="text-sm font-medium text-amber-700">
                New Borrow
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <Trophy className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-700">
                New Challenge
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
