import { axiosClient } from "../lib/axios";
import type { UserResponse, UpdateUserRequest } from "../types/User";

// Get all users
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await axiosClient.get("/users");
  return response.data;
};

// Get user by ID
export const getUserById = async (id: number): Promise<UserResponse> => {
  const response = await axiosClient.get(`/users/${id}`);
  return response.data;
};

// Update user
export const updateUser = async (
  id: number,
  data: UpdateUserRequest
): Promise<UserResponse> => {
  const response = await axiosClient.put(`/users/${id}`, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/users/${id}`);
  return response.data;
};
