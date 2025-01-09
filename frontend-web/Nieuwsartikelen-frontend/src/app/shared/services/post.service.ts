import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostResponse, PostRequest } from '../models/post.model';
import { Notification } from '../models/notification.model';
import { environment } from '../../environments/environment.development';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = environment.baseUrl+'/post/api/post'; 

  http:HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);

  private createHeaders(): HttpHeaders {
      return new HttpHeaders({
        'name': this.authService.getUser(),
        'role': this.authService.getRole()
      });
    }


  getApprovedAndPendingPosts(): Observable<PostResponse[]> {
    const headers = this.createHeaders();
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/approved-pending`, { headers });
  }

  getRejectedPosts(): Observable<PostResponse[]> {
    const headers = this.createHeaders();
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/rejected`, { headers });
  }

  getApprovedPosts(): Observable<PostResponse[]> {
    const headers = this.createHeaders();
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/approved`, { headers });
  }

  getPostById(id: number): Observable<PostResponse> {
    const headers = this.createHeaders();
    return this.http.get<PostResponse>(`${this.baseUrl}/${id}`, { headers });
  }

  getAllDrafts(): Observable<PostResponse[]> {
    const headers = this.createHeaders();
    return this.http.get<PostResponse[]>(`${this.baseUrl}/all/drafted`, { headers });
  }

  createPost(postRequest: PostRequest): Observable<void> {
    const headers = this.createHeaders();
    return this.http.post<void>(`${this.baseUrl}`, postRequest, { headers });
  }

  updatePost(id: number, postRequest: PostRequest): Observable<void> {
    const headers = this.createHeaders();
    return this.http.put<void>(`${this.baseUrl}/${id}`, postRequest, { headers });
  }

  getNotificationsByAuthor(author: string): Observable<Notification[]> {
    const headers = this.createHeaders();
    return this.http.get<Notification[]>(`${this.baseUrl}/${author}/notification`, { headers });
  }
}
