import type { CreateReviewRequest, ReviewResponse } from "../types/review";
import api from "./axios";

export const getProductReviews = async (
  productId: number,
): Promise<ReviewResponse> => {
  const response = await api.get<ReviewResponse>(
    `/products/${productId}/reviews`,
  );

  return response.data;
};

export const createReview = async (
  productId: number,
  data: CreateReviewRequest,
): Promise<void> => {
  await api.post(`/products/${productId}/reviews`, data);
};

export const deleteReview = async (
  productId: number,
  reviewId: number,
): Promise<void> => {
  await api.delete(`/products/${productId}/reviews/${reviewId}`);
};
