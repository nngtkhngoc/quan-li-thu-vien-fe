import { axiosClient } from "../lib/axios";
import type {
  CreateReservationRequest,
  ReservationResponse,
  UpdateReservationRequest,
} from "../types/Reservation";

// Get all reservations
export const getAllReservations = async (): Promise<ReservationResponse[]> => {
  const response = await axiosClient.get("/reservations");
  return response.data.data;
};

// Get reservation by ID
export const getReservationById = async (
  id: number
): Promise<ReservationResponse> => {
  const response = await axiosClient.get(`/reservations/${id}`);
  return response.data.data;
};

export const getMyReservation = async (): Promise<ReservationResponse[]> => {
  const response = await axiosClient.get(`/reservations/me`);
  return response.data.data;
};

// Create new reservation
export const createReservation = async (
  data: CreateReservationRequest
): Promise<ReservationResponse> => {
  const response = await axiosClient.post("/reservations", data);
  return response.data.data;
};

// Update reservation
export const updateReservation = async (
  id: number,
  data: UpdateReservationRequest
): Promise<ReservationResponse> => {
  const response = await axiosClient.put(`/reservations/${id}/return`, data);
  return response.data.data;
};

// Delete reservation
export const deleteReservation = async (
  id: number
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/reservations/${id}`);
  return response.data.data;
};
