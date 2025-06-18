import { axiosClient, axiosClientFormData } from "../lib/axios";
import type { BadgeResponse, CreateOrUpdateBadgeRequest } from "../types/Badge";

export const createBadge = async (data: CreateOrUpdateBadgeRequest) => {
  const response = await axiosClientFormData.post("/badges", data);
  return response.data;
};

export const getBadges = async (): Promise<BadgeResponse> => {
  const response = await axiosClient.get(`/badges`);
  return response.data;
};

export const getUserBadges = async (userId: number) => {
  const response = await axiosClient.get(`/badges/user/${userId}`);
  return response.data;
};

export const updateBadge = async (
  id: number,
  data: CreateOrUpdateBadgeRequest
) => {
  const response = await axiosClientFormData.put(`/badges/${id}`, data);
  return response.data;
};

export const deleteBadge = async (id: number) => {
  const response = await axiosClient.delete(`/badges/${id}`);
  return response.data;
};
