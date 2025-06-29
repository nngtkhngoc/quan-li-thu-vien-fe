/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import {
  createBookItem,
  deleteBookItem,
  getBookItemByBookId,
  updateBookItem,
} from "../api/bookitem.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export const useBookItem = (query: number) => {
  const queryClient = useQueryClient();

  const createBookItemMutation = useMutation({
    mutationFn: async (data: any) => {
      return await createBookItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-items", query] });
    },
  });
  const getBookItemsByBookIdQuery = useQuery({
    queryKey: ["book-items", query],
    queryFn: async () => {
      return await getBookItemByBookId(query);
    },
  });
  const updateBookItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: Number; data: any }) => {
      return await updateBookItem(id, data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["book-items", query] });
    },
  });
  const deleteBookItemMutation = useMutation({
    mutationFn: async (id: Number) => {
      return await deleteBookItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-items", query] });
    },
  });
  return {
    updateBookItemMutation,
    deleteBookItemMutation,
    getBookItemsByBookIdQuery,
    createBookItemMutation,
  };
};
