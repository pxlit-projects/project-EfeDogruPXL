import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentRequest, CommentResponse } from '../models/comment.model';
import { environment } from '../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = environment.baseUrl+'/comment/api/comment'; 
  http:HttpClient = inject(HttpClient);

    authService: AuthService = inject(AuthService);
  
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({
          'name': this.authService.getUser(),
          'role': this.authService.getRole()
        });
      }


  getCommentsByPostId(postId: number): Observable<CommentResponse[]> {
    const headers = this.createHeaders();
    return this.http.get<CommentResponse[]>(`${this.baseUrl}/post/${postId}`, { headers });
  }

  getCommentById(commentId: number): Observable<CommentResponse> {
    const headers = this.createHeaders();
    return this.http.get<CommentResponse>(`${this.baseUrl}/${commentId}`, { headers });
  }

  createComment(postId: number, comment: CommentRequest): Observable<void> {
    const headers = this.createHeaders();
    return this.http.post<void>(`${this.baseUrl}/${postId}`, comment, { headers });
  }

  updateComment(id: number, commentText: string): Observable<void> {
    const headers = this.createHeaders();
    return this.http.put<void>(`${this.baseUrl}/${id}`, commentText , { headers });
  }

  deleteComment(id: number): Observable<void> {
    const headers = this.createHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
}
