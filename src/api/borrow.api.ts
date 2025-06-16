import { axiosClient } from "../lib/axios";
import type {
  BorrowBookResponse,
  CreateBorrowedBookRequest,
  UpdateBorrowedBookRequest,
} from "../types/Borrow";

// Get all borrowed books
export const getAllBorrowedBooks = async (): Promise<BorrowBookResponse[]> => {
  const response = await axiosClient.get("/borrowed-books");
  return response.data;
};

// Get borrowed book by ID
export const getBorrowedBookById = async (
  id: number
): Promise<BorrowBookResponse> => {
  const response = await axiosClient.get(`/borrowed-books/${id}`);
  return response.data;
};

// Create new borrowed book
export const createBorrowedBook = async (
  data: CreateBorrowedBookRequest
): Promise<BorrowBookResponse> => {
  const response = await axiosClient.post("/borrowed-books", data);
  return response.data;
};

// Update borrowed book
export const updateBorrowedBook = async (
  id: number,
  data: UpdateBorrowedBookRequest
): Promise<BorrowBookResponse> => {
  const response = await axiosClient.put(`/borrowed-books/${id}`, data);
  console.log("Thay đổi thành công");
  return response.data;
};

// Delete borrowed book
export const deleteBorrowedBook = async (
  id: number
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/borrowed-books/${id}`);
  return response.data;
};
