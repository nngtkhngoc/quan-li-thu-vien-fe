import { axiosClient } from "../lib/axios";
import type { BookItemCreate, BookItemUpdate } from "../types/BookItem";

export const getBookItems = async ({
  page,
  size,
}: {
  page: Number;
  size: Number;
}) => {
  const response = await axiosClient.get(
    `/bookitems?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}`
  );
  return response.data.data;
};

export const createBookItem = async (data: BookItemCreate) => {
  const response = await axiosClient.post("/book-items", data);
  return response.data.data;
};

export const updateBookItem = async (id: Number, data: BookItemUpdate) => {
  const response = await axiosClient.put(`/book-items/${id}`, data);
  return response.data.data;
};

export const deleteBookItem = async (id: Number) => {
  const response = await axiosClient.delete(`/book-items/${id}`);
  return response.data.data;
};
