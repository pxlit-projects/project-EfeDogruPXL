export interface CommentResponse {
    id: number;
    comment: string;
    author: string;
    createdAt: string;
  }
  
  export interface CommentRequest {
    comment: string;
    author: string;
  }