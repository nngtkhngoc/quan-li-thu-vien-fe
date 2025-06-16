import { axiosClient } from "../lib/axios";
import type {
  DeleteNotificationsRequest,
  GetAllNotificationsResponse,
  UpdateNotificationRequest,
  UpdateNotificationResponse,
} from "../types/Notification";

export interface GetNotificationParams {
  page?: number;
  limit?: number;
  seen?: boolean;
}

export const getAllNotifications = async (
  params: GetNotificationParams = {}
): Promise<GetAllNotificationsResponse> => {
  const res = await axiosClient.get("/notifications", { params });
  return res?.data;
};

export const getNotificationsByUserId = async (
  userId: string,
  params: GetNotificationParams = {}
): Promise<GetAllNotificationsResponse> => {
  const res = await axiosClient.get(`/notifications/${userId}`, { params });
  return res?.data;
};

export const updateNotification = async (
  notificationId: BigInteger,
  data: UpdateNotificationRequest
): Promise<UpdateNotificationResponse> => {
  const res = await axiosClient.put(`/notifications/${notificationId}`, data);
  return res?.data;
};

export const deleteNotifications = async (
  data: DeleteNotificationsRequest
): Promise<DeleteNotificationsRequest> => {
  const res = await axiosClient.delete(`/notifications`, { data });
  return res?.data;
};

export const deleteNotification = async (
  notificationId: string
): Promise<DeleteNotificationsRequest> => {
  const res = await axiosClient.delete(`/notifications/${notificationId}`);
  return res?.data;
};
