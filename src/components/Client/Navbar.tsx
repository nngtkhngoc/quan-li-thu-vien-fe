import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Moon, Menu, X, BookOpen, Sun } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { signOut } from "../../api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNotification } from "../../contexts/notificationContext";

const Header: React.FC = () => {
  const { userProfile } = useUser();
  const { setUserChanged } = useUser();

  const [isDark, setIsDark] = useState(localStorage.theme);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const { newNotifications } = useNotification();

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      setUserChanged(true);
      queryClient.clear();
      navigate("/");
      toast.success("Đăng xuất thành công");
      setUserChanged(true);
    },
    onError: () => {
      toast.error("Đăng xuất thất bại");
    },
  });

  const isActivePage = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/books", label: "Sách" },
    { path: "/forum", label: "Diễn đàn" },
    { path: "/search", label: "Tìm kiếm" },
  ];
  useEffect(() => {
    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    }
  }, []);
  const toggleTheme = () => {
    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
      setIsDark("light");

      document.documentElement.classList.remove("dark");
    } else {
      localStorage.theme = "dark";
      setIsDark("dark");

      document.documentElement.classList.add("dark");
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LibraryHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  isActivePage(item.path)
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark == "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {userProfile ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {newNotifications && newNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {newNotifications.length}
                    </span>
                  )}
                </Link>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Yêu thích"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.435 6.304a5.373 5.373 0 0 0-7.6 0l-.835.834-.835-.834a5.373 5.373 0 0 0-7.6 7.6l.834.835 7.601 7.6 7.601-7.6.834-.835a5.373 5.373 0 0 0 0-7.6z"
                    />
                  </svg>
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {userProfile?.image ? (
                      <img
                        src={userProfile.image}
                        alt={userProfile.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="0.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-circle-user-icon lucide-circle-user"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                    )}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userProfile?.name}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Hồ sơ của tôi
                      </Link>
                      <Link
                        to="/borrowed-books"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sách đang mượn
                      </Link>
                      <Link
                        to="/reservations"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sách đang đặt trước
                      </Link>
                      {userProfile.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Quản trị viên
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => signOutMutation.mutate()}
                        disabled={signOutMutation.isPending}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {signOutMutation.isPending
                          ? "Đang đăng xuất..."
                          : "Đăng xuất"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                {/* <User className="h-4 w-4" /> */}
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium whitespace-nowrap ${
                    isActivePage(item.path)
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
