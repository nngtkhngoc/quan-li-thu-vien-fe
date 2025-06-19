import { axiosClient } from "../lib/axios";
export const getChatbotResponseByUserId = async (
  userId: number
): Promise<any> => {
  const response = await axiosClient.get(`/chatbot/user/${userId}`);
  return response.data;
};

export const createChatbotResponse = async (data: any): Promise<any> => {
  const response = await axiosClient.post(`/chatbot`, data);
  return response.data;
};
