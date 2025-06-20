import { axiosClient } from "../lib/axios";
export const getWishlist = async (id: number) => {
  const response = await axiosClient.get(`/wishlist/user/${id}`);
  return response.data;
};
export const addToWishlist = async ({ book_id, user_id }: any) => {
  const response = await axiosClient.post(`/wishlist/${user_id}/${book_id}`);
  return response.data;
};

export const deleteWishlist = async ({ book_id, user_id }: any) => {
  const response = await axiosClient.delete(`/wishlist/${user_id}/${book_id}`);
  return response.data;
};
