import { axiosClient } from "../lib/axios";

export interface CreateMessageRequest {
  senderName: string;
  content: string;
}

export interface MessageResponse {
  id: number;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface UpdateMessageRequest {
  content: string;
}

// Get all messages
export const getAllMessages = async (): Promise<MessageResponse[]> => {
  const response = await axiosClient.get("/chat/messages");
  return response.data;
};

// Create a new message (not used for real-time chat, but can be useful)
export const createMessage = async (
  messageData: CreateMessageRequest
): Promise<MessageResponse> => {
  const response = await axiosClient.post("/chat/messages", messageData);
  return response.data;
};

// Update message by ID
export const updateMessage = async (
  id: number,
  messageData: UpdateMessageRequest
): Promise<MessageResponse> => {
  const response = await axiosClient.put(`/chat/messages/${id}`, messageData);
  return response.data;
};

// Delete message by ID
export const deleteMessage = async (id: number): Promise<void> => {
  const response = await axiosClient.delete(`/chat/messages/${id}`);
  return response.data;
};
