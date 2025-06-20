import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getAllMessages,
  updateMessage,
  deleteMessage,
  getActiveUsers,
} from "../api/message.api";
import type { UpdateMessageRequest, MessageResponse } from "../api/message.api";

export const useMessage = () => {
  const queryClient = useQueryClient();

  const getMessagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: getAllMessages,
  });

  const { data: numActiveUsers } = useQuery({
    queryKey: ["active-users"],
    queryFn: getActiveUsers,
    refetchInterval: 1000,
  });

  const updateMessageMutation = useMutation({
    mutationFn: ({
      id,
      messageData,
    }: {
      id: number;
      messageData: UpdateMessageRequest;
    }) => updateMessage(id, messageData),
    onMutate: async ({ id, messageData }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["messages"] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<MessageResponse[]>([
        "messages",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<MessageResponse[]>(["messages"], oldData => {
        if (!oldData) return [];
        return oldData.map(msg =>
          msg.id === id ? { ...msg, content: messageData.content } : msg
        );
      });

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (_err, _newMessage, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["messages"], context?.previousMessages);
      toast.error("Không thể cập nhật tin nhắn. Vui lòng thử lại.");
    },
    onSuccess: () => {
      toast.success("Cập nhật tin nhắn thành công!");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  // Delete message mutation with optimistic updates
  const deleteMessageMutation = useMutation({
    mutationFn: (id: number) => deleteMessage(id),
    onMutate: async deletedId => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["messages"] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<MessageResponse[]>([
        "messages",
      ]);

      // Optimistically remove the message
      queryClient.setQueryData<MessageResponse[]>(["messages"], oldData => {
        if (!oldData) return [];
        return oldData.filter(msg => msg.id !== deletedId);
      });

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (_err, _deletedId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["messages"], context?.previousMessages);
      toast.error("Không thể xóa tin nhắn. Vui lòng thử lại.");
    },
    onSuccess: () => {
      toast.success("Xóa tin nhắn thành công!");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  return {
    // Queries
    messages: getMessagesQuery.data,
    isLoadingMessages: getMessagesQuery.isLoading,
    isErrorMessages: getMessagesQuery.isError,
    errorMessages: getMessagesQuery.error,
    refetchMessages: getMessagesQuery.refetch,

    // Mutations
    updateMessageMutation,
    deleteMessageMutation,

    // Mutation states and functions
    isUpdatingMessage: updateMessageMutation.isPending,
    isDeletingMessage: deleteMessageMutation.isPending,
    updatingMessageId: updateMessageMutation.variables?.id,
    deletingMessageId: deleteMessageMutation.variables,

    updateMessage: updateMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,

    numActiveUsers,
  };
};

export default useMessage;
