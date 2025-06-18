import { axiosClient, axiosClientFormData } from "../lib/axios";

export const createBook = async (formData: FormData) => {
  const response = await axiosClientFormData.post("/books", formData);
  return response.data;
};
export const getBooks = async (query: string) => {
  const response = await axiosClient.get(`/books?sort=id&${query}`);
  return response.data;
};

export const updateBook = async (id: Number, formData: FormData) => {
  const response = await axiosClientFormData.put(`/books/${id}`, formData);
  return response.data;
};
export const getBookById = async (id: Number) => {
  const response = await axiosClient.get(`/books/${id}`);
  return response.data;
};
export const deleteBook = async (id: Number) => {
  const response = await axiosClient.delete(`/books/${id}`);
  return response.data;
};

export const getDashboard = async () => {
  const response = await axiosClient.get(`/books/dashboard`);
  return response.data;
};
