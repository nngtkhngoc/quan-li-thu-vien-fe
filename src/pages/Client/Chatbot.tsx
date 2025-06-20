/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bot, BotIcon, Send, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChatbotResponse,
  getChatbotResponseByUserId,
} from "../../api/chatbot.api";
function cleanMessage(text: string) {
  return text
    .replace(/\[.*?\]/g, "")
    .replace(/【.*?】/g, "")
    .replace(/\*+/g, "")
    .replace(/[^\w\sÀ-ỹà-ỹ.,!?]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const user = useUser();
  const userId = user.userProfile?.id;

  const toggleChat = () => setIsOpen(!isOpen);

  const getChatbotResponseQuery = useQuery({
    queryKey: ["chatbotMessages", userId],
    queryFn: async () => {
      return await getChatbotResponseByUserId(userId!);
    },
    enabled: !!userId,
  });
  const messages = getChatbotResponseQuery.data || [];
  console.log(messages);
  const queryClient = useQueryClient();
  const createChatbotResponseMutation = useMutation({
    mutationFn: async (message: string) => {
      return await createChatbotResponse({
        message,
        user_id: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatbotMessages", userId],
      });
    },
    onError: () => {
      toast.error("Lỗi khi gửi tin nhắn tới chatbot.");
      setIsWaiting(false);
    },
  });

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      setInput("");
      setIsWaiting(true);
      await createChatbotResponseMutation.mutateAsync(userMessage);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="w-[300px] h-[400px] lg:w-[400px] lg:h-[450px] z-50 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-3 py-4 flex justify-between items-center">
            <div className="flex gap-2 items-center justify-center font-bold">
              <BotIcon className="w-7 h-7" /> Bibot
            </div>
            <button onClick={toggleChat}>
              <X className="text-xl text-white" />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((msg: any, idx: any) => (
              <div className="flex flex-row gap-2">
                {msg._bot && (
                  <div className=" text-white w-10 h-10  flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                    <BotIcon className="w-6 h-6" />
                  </div>
                )}

                <div
                  key={idx}
                  className={`p-2 rounded-md max-w-[60%] text-[14px] ${
                    msg._bot === false
                      ? "bg-purple-200 self-end ml-auto "
                      : "bg-gray-100"
                  }`}
                >
                  {cleanMessage(msg.message)}
                </div>

                {!msg._bot &&
                  (user.userProfile?.image ? (
                    <img
                      src={user.userProfile.image}
                      alt={user.userProfile.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-gray-900 dark:text-white">
                      {user.userProfile?.name?.charAt(0).toUpperCase()}
                    </span>
                  ))}
              </div>
            ))}
            {createChatbotResponseMutation.isPending && (
              <div className="p-2 ">
                <span className="inline-flex space-x-1">
                  <span className="animate-bounce delay-0 w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span className="animate-bounce delay-1000 w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="animate-bounce delay-1500 w-2 h-2 bg-purple-700 rounded-full"></span>
                </span>
              </div>
            )}
          </div>
          <div className="p-3 border-t flex gap-2 border-zinc-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border border-zinc-400 focus:outline-purple-500 rounded px-2 py-2 text-sm"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 rounded bg-gradient-to-br from-blue-600 to-purple-600 cursor-pointer"
              disabled={!input.trim() || isWaiting}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            if (!userId) {
              toast.error("Vui lòng đăng nhập để sử dụng tính năng này.");
              return;
            }
            toggleChat();
          }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          <Bot />
        </button>
      )}
    </div>
  );
}
