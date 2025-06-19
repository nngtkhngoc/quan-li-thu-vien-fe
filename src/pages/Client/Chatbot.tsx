import { Bot, X } from "lucide-react";
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
        <div className="w-[300px] h-[400px] lg:w-[500px] z-50 bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="dark:bg-gray-800 text-white p-3 flex justify-between items-center">
            <span>Chatbot</span>
            <button onClick={toggleChat}>
              <X className="text-xl" />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg: any, idx: any) => (
              <div
                key={idx}
                className={`p-2 rounded-md max-w-[75%] ${
                  msg._bot === false
                    ? "bg-blue-100 self-end ml-auto"
                    : "bg-gray-200"
                }`}
              >
                {cleanMessage(msg.message)}
              </div>
            ))}
            {createChatbotResponseMutation.isPending && (
              <div className="p-2 bg-gray-200 rounded-md">
                <span className="inline-flex space-x-1">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              </div>
            )}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded px-2 py-1"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 rounded"
              disabled={!input.trim() || isWaiting}
            >
              Gửi
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
