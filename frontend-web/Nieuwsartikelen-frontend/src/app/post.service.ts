import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface Notification {
  id: number;
  author: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = 'http://localhost:8081/api/post'; 

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all`);
  }

  getApprovedAndPendingPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/approved-pending`);
  }

  getRejectedPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/rejected`);
  }

  getApprovedPosts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/approved`);
  }

  getPostById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}/${id}`);
  }

  getAllDrafts(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/drafted`);
  }

  createPost(postRequest: PostRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}`, postRequest);
  }

  updatePost(id: number, postRequest: PostRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, postRequest);
  }

  getNotificationsByAuthor(author: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/${author}/notification`);
  }
}
