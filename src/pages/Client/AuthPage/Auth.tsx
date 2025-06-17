import { useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

export default function Auth() {
  const [option, setOption] = useState("SignIn");
  return (
    <div className="w-screen bg-white font-primary text-center py-10 flex flex-col gap-3 items-center">
      <div className="font-bold text-2xl">TÀI KHOẢN CỦA TÔI</div>
      <div className="pb-10">
        Đăng ký ngay để nhận các ưu đãi độc quyền từ{" "}
        <span className="text-primary font-bold">JewelryStore</span>{" "}
      </div>

      <div className="w-full md:w-1/2 lg:w-1/3">
        <div className="w-full px-4 grid grid-cols-2 uppercase font-semibold text-[16px] gap-3 ">
          <div
            onClick={() => {
              setOption("SignIn");
            }}
            className={`pb-2 border-b-3 px-2 cursor-pointer ${
              option == "SignIn"
                ? "text-black border-black"
                : "text-zinc-400 border-zinc-400"
            }`}
          >
            Đăng nhập
          </div>
          <div
            onClick={() => {
              setOption("SignUp");
            }}
            className={`pb-2 border-b-3 px-2 cursor-pointer ${
              option == "SignUp"
                ? "text-black border-black"
                : "text-zinc-400 border-zinc-400"
            }`}
          >
            Đăng ký
          </div>
        </div>

        <div className="w-full p-3 px-5">
          {option == "SignIn" ? <SignIn /> : <SignUp />}
        </div>
      </div>
    </div>
  );
}
