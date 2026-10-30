export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewResponse{
  average : number,
  count : number,
  reviews: Review[];
}

export interface CreateReviewRequest {
  rating : number,
  comment : string
}