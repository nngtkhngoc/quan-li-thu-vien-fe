import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageResponse } from "../api/message.api";

export interface ChatMessage {
  id?: number;
  sender: {
    id: number;
    name: string;
    image: string;
  };
  content: string;
  timestamp: string;
}

export function useChat(userId: number) {
  const client = useRef<CompatClient | null>(null);
  const queryClient = useQueryClient();

  // Kết nối socket - chỉ phụ thuộc vào userId
  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(import.meta.env.VITE_SOCKET_URL);
    const stompClient = Stomp.over(socket);
    client.current = stompClient;

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/public", msg => {
        const received: MessageResponse = JSON.parse(msg.body);
        // Update React Query cache with new message
        queryClient.setQueryData<MessageResponse[]>(["messages"], oldData => {
          if (!oldData) return [received];
          // Check if message already exists to avoid duplicates
          const exists = oldData.some(message => message.id === received.id);
          if (exists) return oldData;
          return [...oldData, received];
        });
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, [userId, queryClient]);

  // Gửi tin nhắn
  const sendMessage = (content: string) => {
    if (client.current?.connected) {
      client.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({ sender_id: userId, content })
      );
    }
  };

  return { sendMessage };
}
