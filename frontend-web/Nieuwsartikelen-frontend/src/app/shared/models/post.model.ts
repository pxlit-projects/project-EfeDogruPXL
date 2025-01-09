export interface Post {
    title: string;
    content: string;
    author: string;
    isDraft: boolean;
}

export interface PostResponse {
    id: number;
    title: string;
    author: string;
    content: string;
    createdAt: string;
    isDraft: boolean;
    
    reviewContent: string;
    reviewAuthor: string;
    status: string;
  }
  
  export interface PostRequest {
    title: string;
    content: string;
    author: string;
    isDraft: boolean;
  }

