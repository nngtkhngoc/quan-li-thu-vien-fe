/* eslint-disable @typescript-eslint/no-explicit-any */
export type Notification = {
  id: BigInteger;
  user: any;
  seen: boolean;
  message: string;
  createdAt: Date;
};

export type GetAllNotificationsResponse = {
  success: boolean;
  message: string;
  data: Notification[];
};

export type UpdateNotificationResponse = {
  success: boolean;
  message: string;
  data: Notification;
};

export type DeleteNotificationResponse = {
  success: boolean;
  message: string;
  data: null;
};

export type CreateNotificationRequest = {
  user_id: number;
  message: string;
};

export type UpdateNotificationRequest = {
  message?: string;
  seen?: boolean;
};

export type DeleteNotificationsRequest = {
  ids: BigInteger[];
};
