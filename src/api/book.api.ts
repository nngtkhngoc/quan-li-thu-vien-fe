import { axiosClient } from "../lib/axios";

export const createBook = async (formData: FormData) => {
  const response = await axiosClient.post("/books", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};
export const getBooks = async (query: string) => {
  const response = await axiosClient.get(`/books?${query}`);
  return response.data;
};

export const updateBook = async (formData: FormData) => {
  const response = await axiosClient.put("/books", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

export const deleteBook = async (id: Number) => {
  const response = await axiosClient.delete(`/books/${id}`);
  return response.data.data;
};
