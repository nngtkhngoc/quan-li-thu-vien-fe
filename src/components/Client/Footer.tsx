import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-100 via-purple-80 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + Library name */}
        <div>
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LibraryHub
            </span>
          </Link>

          <p className="mt-2 text-sm">
            Nơi lưu trữ tri thức – Mượn, đọc và khám phá hàng ngàn đầu sách mọi
            lúc, mọi nơi.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-purple-600">
            Liên kết nhanh
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-pink-500 transition">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition">
                Hướng dẫn mượn sách
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition">
                Liên hệ hỗ trợ
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3  text-purple-600">
            Kết nối
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://facebook.com"
                className="hover:text-blue-500 transition"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="mailto:thuviensinhvien@library.edu.vn"
                className="hover:text-green-500 transition"
              >
                Gửi email
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-7 text-center text-sm">
        © {new Date().getFullYear()} LibraryHub – Một sản phẩm bởi Nhóm 17 ✨
      </div>
    </footer>
  );
}
