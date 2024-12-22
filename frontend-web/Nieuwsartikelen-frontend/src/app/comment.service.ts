import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8084/api/comment'; 


  constructor(private http: HttpClient) { }

  getCommentsByPostId(postId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.baseUrl}/post/${postId}`);
  }

  getCommentById(commentId: number): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.baseUrl}/${commentId}`);
  }

  createComment(postId: number, comment: CommentRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${postId}`, comment);
  }

  updateComment(id: number, commentText: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, commentText );
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
