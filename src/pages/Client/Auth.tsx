import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, BookOpen, Mail, Lock } from "lucide-react";
import { signIn, signUp } from "../../api/user.api";
import type { SignInData, CreateUserRequest } from "../../types/User";
import { useUser } from "../../hooks/useUser";
import { toast } from "react-toastify";
import axios from "axios";

interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { setUserChanged } = useUser();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu không khớp";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    const signInData: SignInData = {
      email: formData.email,
      password_hash: formData.password,
    };
    await signIn(signInData);
    toast.success("Đăng nhập thành công!");
    navigate("/");
  };

  const handleRegister = async () => {
    const signUpData: CreateUserRequest = {
      name: formData.name,
      email: formData.email,
      password_hash: formData.password,
    };
    await signUp(signUpData);
    toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
    setIsLogin(true);
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setUserChanged(true);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 group mb-8"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LibraryHub
            </span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLogin
              ? "Đăng nhập để tiếp tục hành trình đọc sách của bạn"
              : "Tham gia cộng đồng độc giả của chúng tôi"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Họ và tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  className={`w-full px-4 py-3 border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Nhập họ và tên của bạn"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Địa chỉ email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Nhập email của bạn"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="password"
                  className={`w-full pl-10 pr-12 py-3 border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Nhập mật khẩu của bạn"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Nhập lại mật khẩu của bạn"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Vui lòng đợi...
                </div>
              ) : isLogin ? (
                "Đăng nhập"
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                {isLogin ? "Tạo tài khoản mới" : "Đăng nhập"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
