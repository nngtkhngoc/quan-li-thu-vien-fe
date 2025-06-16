import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createBook, deleteBook, getBooks, updateBook } from "../api/book.api";
import { getAllCatalogs } from "../api/catalog.api";
export const useBook = (query: string) => {
  const queryClient = useQueryClient();

  const getCatalogsQuery = useQuery({
    queryKey: ["catalogs"],
    queryFn: async () => {
      return await getAllCatalogs();
    },
  });
  const getBookQuery = useQuery({
    queryKey: ["books", query],
    queryFn: async () => {
      return await getBooks(query);
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: Number;
      formData: FormData;
    }) => {
      return await updateBook(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
  const createBookMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await createBook(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: Number) => {
      return await deleteBook(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return {
    getCatalogsQuery,
    getBookQuery,
    updateBookMutation,
    createBookMutation,
    deleteBookMutation,
  };
};
