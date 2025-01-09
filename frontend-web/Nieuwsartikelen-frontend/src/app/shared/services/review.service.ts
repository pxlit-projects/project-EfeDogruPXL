import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewRequest, ReviewResponse } from '../models/review.model';
import { environment } from '../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = environment.baseUrl+'/review/api/review'; 
  http:HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'name': this.authService.getUser(),
      'role': this.authService.getRole()
    });
  }
  
  makeReview(postId: number, review: ReviewRequest): Observable<void> {
    const headers = this.createHeaders();
    return this.http.post<void>(`${this.baseUrl}/${postId}`, review, { headers });
  }

  getReviewByPostId(postId: number): Observable<ReviewResponse> {
    const headers = this.createHeaders();
    return this.http.get<ReviewResponse>(`${this.baseUrl}/${postId}`, { headers });
  }
}
