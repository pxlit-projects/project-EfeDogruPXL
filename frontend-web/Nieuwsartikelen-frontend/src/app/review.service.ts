import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8082/api/review'; 

  constructor(private http: HttpClient) { }

  makeReview(postId: number, review: ReviewRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${postId}`, review);
  }

  getReviewByPostId(postId: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.baseUrl}/${postId}`);
  }
}
