import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Hãy khám phá
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">
            thư viện chúng tôi!
          </span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          Tham gia vào cộng đồng độc giả sôi nổi của chúng tôi. Khám phá hàng
          ngàn cuốn sách, tham gia các thử thách đọc và mở khóa thành tựu khi
          bạn đắm chìm vào những thế giới mới.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/books"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Mượn sách
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <Link
            to="/forum"
            className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Trò chuyện
          </Link>
        </div>
      </div>
    </section>
  );
}
