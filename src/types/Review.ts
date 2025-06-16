/* eslint-disable @typescript-eslint/no-explicit-any */
export type Review = {
  review_id: BigInteger;
  user: any;
  book: any;
  rating: Float16Array;
  comment: string;
  createdAt: Date;
};

export type GetAllReviewsResponse = {
  success: boolean;
  message: string;
  data: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    items: Review[];
  };
};

export type GetReviewByIdResponse = {
  success: boolean;
  message: string;
  data: Review;
};

export type DeleteReviewResponse = {
  success: boolean;
  message: string;
  data: null;
};

export type DeleteReviewsRequest = {
  ids: BigInteger[];
};
