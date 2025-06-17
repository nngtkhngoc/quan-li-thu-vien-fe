/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";
import { signUp } from "../../../../api/user.api";

import { useNavigate } from "react-router";

export default function SignUp() {
  const [seePassword, setSeePassword] = useState(false);
  const [seeCfPassword, setSeeCfPassword] = useState(false);

  const handleSeePassword = () => {
    setSeePassword(!seePassword);
  };

  const handleSeeCfPassword = () => {
    setSeeCfPassword(!seeCfPassword);
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirm_password) {
      setIsLoading(false);
      return;
    }
    try {
      await signUp({
        name: username,
        email,
        password_hash: password,
      });

      nav("/");
      window.location.reload();
    } catch (error: any) {
      console.log(
        "Error in sign up: " + error?.response?.data?.message || "Lỗi hệ thống"
      );
    }
    setIsLoading(false);
  };

  return (
    <form
      className="border border-zinc-300 w-full px-4 py-5 space-y-2 flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 text-start"
        >
          Tên đăng nhập
        </label>
        <input
          type="text"
          id="username"
          className="mt-1 block w-full border border-zinc-300 px-3 py-2 focus:outline-primary text-sm"
          minLength={6}
          maxLength={20}
          required
          placeholder="Nhập tên của bạn"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 text-start"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full border border-zinc-300 px-3 py-2 focus:outline-primary text-sm"
          required
          placeholder="Nhập email của bạn"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div className="flex flex-col gap-1 relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 text-start"
        >
          Mật khẩu
        </label>
        <input
          type={seePassword ? "text" : "password"}
          id="password"
          className="mt-1 block w-full border border-zinc-300 px-3 py-2 focus:outline-primary text-sm"
          required
          minLength={6}
          maxLength={20}
          placeholder="Nhập mật khẩu"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {!seePassword ? (
          <EyeIcon
            className="absolute right-2 bottom-[6px] text-zinc-500"
            onClick={handleSeePassword}
          />
        ) : (
          <EyeClosed
            className="absolute right-2 bottom-[6px] text-zinc-500"
            onClick={handleSeePassword}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 relative">
        <label
          htmlFor="confirm_password"
          className="block text-sm font-medium text-gray-700 text-start"
        >
          Xác nhận mật khẩu
        </label>
        <input
          type={seeCfPassword ? "text" : "password"}
          id="confirm_password"
          className="mt-1 block w-full border border-zinc-300 px-3 py-2 focus:outline-primary text-sm"
          required
          minLength={6}
          maxLength={20}
          placeholder="Nhập mật khẩu"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
        {!seeCfPassword ? (
          <EyeIcon
            className="absolute right-2 bottom-[6px] text-zinc-500"
            onClick={handleSeeCfPassword}
          />
        ) : (
          <EyeClosed
            className="absolute right-2 bottom-[6px] text-zinc-500"
            onClick={handleSeeCfPassword}
          />
        )}
      </div>

      <button
        type="submit"
        className="py-2 bg-primary text-white font-semibold cursor-pointer border-2 border-primary hover:bg-white  hover:text-primary transition-all duration-300 "
        disabled={isLoading}
      >
        {isLoading ? "Đang xử lý..." : "ĐĂNG KÝ"}
      </button>
    </form>
  );
}
