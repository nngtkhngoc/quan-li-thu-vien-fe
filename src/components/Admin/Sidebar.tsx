import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowRightLeft,
  Calendar,
  Star,
  Bell,
  Library,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const navigation = [
  { name: "Trang chủ", href: "/admin", icon: LayoutDashboard },
  { name: "Sách", href: "/admin/books", icon: BookOpen },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Sách đã mượn", href: "/admin/borrows", icon: ArrowRightLeft },
  { name: "Đặt trước", href: "/admin/reservations", icon: Calendar },
  { name: "Đánh giá", href: "/admin/reviews", icon: Star },
  { name: "Thông báo", href: "/admin/notifications", icon: Bell },
  { name: "Huy hiệu", href: "/admin/badges", icon: Award },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Library className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              LibraryAdmin
            </span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            {
              console.log(location.pathname);
            }
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
