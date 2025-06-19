import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageResponse } from "../api/message.api";

export interface ChatMessage {
  id?: number;
  senderName: string;
  content: string;
  timestamp: string;
}

export function useChat(username: string) {
  const client = useRef<CompatClient | null>(null);
  const queryClient = useQueryClient();

  // Kết nối socket - chỉ phụ thuộc vào username
  useEffect(() => {
    if (!username) return;

    const socket = new SockJS("http://localhost:5002/ws-chat");
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
  }, [username, queryClient]);

  // Gửi tin nhắn
  const sendMessage = (content: string) => {
    if (client.current?.connected) {
      client.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({ senderName: username, content })
      );
    }
  };

  return { sendMessage };
}
