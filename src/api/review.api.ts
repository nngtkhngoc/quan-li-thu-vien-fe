import { axiosClient } from "../lib/axios";
import type {
  DeleteReviewsRequest,
  GetAllReviewsResponse,
  GetReviewByIdResponse,
} from "../types/Review";

export interface GetAllReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
}

export const getAllReviews = async (
  params: GetAllReviewsParams = {}
): Promise<GetAllReviewsResponse> => {
  const res = await axiosClient.get("/reviews", { params });
  return res?.data;
};

export const getReviewById = async (
  id: string
): Promise<GetReviewByIdResponse> => {
  const res = await axiosClient.get(`reviews/${id}`);
  return res?.data;
};

export const deleteReviews = async (
  data: DeleteReviewsRequest
): Promise<DeleteReviewsRequest> => {
  const res = await axiosClient.delete(`/reviews`, { data });
  return res?.data;
};
