export interface ReviewRequest {
  content: string;
  author: string;
  isApproved: boolean;
}

export interface ReviewResponse {
  content: string;
  postId: number;
  author: string;
  isApproved: boolean;
}