import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

export interface ChatMessage {
  id?: number;
  senderName: string;
  content: string;
  timestamp: string;
}

export function useChat(username: string, endMessageEl: any) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const client = useRef<CompatClient | null>(null);

  // Kết nối socket
  useEffect(() => {
    const socket = new SockJS("http://localhost:5002/ws-chat");
    const stompClient = Stomp.over(socket);
    client.current = stompClient;

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/public", msg => {
        const received: ChatMessage = JSON.parse(msg.body);
        setMessages(prev => [...prev, received]);
        endMessageEl?.scrollIntoView({ behavior: "smooth" });
      });

      // Load tin nhắn cũ từ REST API
      fetch("http://localhost:5002/api/chat/messages")
        .then(res => res.json())
        .then((data: ChatMessage[]) => setMessages(data));
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

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

  return { messages, sendMessage };
}
